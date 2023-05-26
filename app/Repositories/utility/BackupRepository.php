<?php
namespace App\Repositories\Utility;

use App\Helper\Shuttle_Dumper;
use App\Models\Utility\Backup;
use Illuminate\Validation\ValidationException;

class BackupRepository
{
    protected $backup;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Backup $backup
    ) {
        $this->backup = $backup;
    }

    /**
     * Find backup with given id or throw an error.
     *
     * @param integer $id
     * @return Backup
     */
    public function findOrFail($id)
    {
        $backup = $this->backup->find($id);

        if (! $backup) {
            throw ValidationException::withMessages(['message' => trans('utility.could_not_find_backup')]);
        }

        return $backup;
    }

    /**
     * Paginate all backups using given params.
     *
     * @param array $params
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function paginate($params)
    {
        $sort_by     = gv($params, 'sort_by', 'created_at');
        $order       = gv($params, 'order', 'desc');
        $page_length = gv($params, 'page_length', config('config.page_length'));

        return $this->backup->orderBy($sort_by, $order)->paginate($page_length);
    }

    /**
     * Generate a new backup.
     *
     * @param array $params
     * @return Backup
     */
    public function generate($params = array())
    {
        if (gbv($params, 'delete_previous')) {
            $this->deletePrevious();
        }

        \Storage::makeDirectory('backup');

        $file = $this->export();

        return $this->backup->forceCreate([
            'file'    => $file,
            'user_id' => (\Auth::check()) ? \Auth::user()->id : null
        ]);
    }

    /**
     * Export database.
     *
     * @return filename of backup as string
     */
    public function export()
    {
        try {
            $db_export = Shuttle_Dumper::create(array(
                'host' => env('DB_HOST'),
                'username' => env('DB_USERNAME'),
                'password' => env('DB_PASSWORD'),
                'db_name' => env('DB_DATABASE'),
            ));

            $file = 'backup_'.date('Y_m_d_H_i_s').'.sql.gz';
            $full_path = storage_path('app/backup/'.$file);
            $db_export->dump($full_path);
        } catch (Shuttle_Exception $e) {
            throw($e);
        }

        return $file;
    }

    /**
     * Delete previous backup.
     *
     * @param array $params
     * @return null
     */
    public function deletePrevious()
    {
        $this->backup->truncate();
        \Storage::deleteDirectory('backup');
    }

    /**
     * Delete backup.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(Backup $backup)
    {
        return $backup->delete();
    }

    /**
     * Delete multiple backups.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->backup->whereIn('id', $ids)->delete();
    }
}
