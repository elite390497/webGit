<?php

namespace App\Http\Controllers\Utility;

use Illuminate\Http\Request;
use App\Repositories\Utility\BackupRepository;
use App\Http\Controllers\Controller;

class BackupController extends Controller
{
    protected $request;
    protected $repo;

    protected $module = 'backup';

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request, BackupRepository $repo)
    {
        $this->repo = $repo;
        $this->request = $request;

        $this->middleware('permission:access-configuration');
        $this->middleware('feature.available:backup');
        $this->middleware('prohibited.test.mode')->only('download');
    }

    /**
     * Used to get all Backups
     * @get ("/api/backup")
     * @return Response
     */
    public function index()
    {
        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to store Backup
     * @post ("/api/backup")
     * @param ({
     *      @Parameter("deletePrevious", type="checkbox", required="true", description="Delete or not to delete previous backup"),
     * })
     * @return Response
     */
    public function store()
    {
        $backup = $this->repo->generate($this->request->all());

        return $this->success(['message' => trans('utility.backup_generated')]);
    }

    /**
     * Used to download Backup
     * @get ("/backup/{id}/download")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of backup to be downloaded"),
     * })
     * @return Response download
     */
    public function download($id)
    {
        $backup = $this->repo->findOrFail($id);

        if (! \Storage::exists('backup/'.$backup->file)) {
            return view('errors.file-not-found');
        }

        activity('backup')->on($backup)->log('downloaded');

        $download_path = storage_path('app/backup/'.$backup->file);

        return response()->download($download_path);
    }

    /**
     * Used to delete Backup
     * @delete ("/api/backup/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of backup to be deleted"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $backup = $this->repo->findOrFail($id);

        if (\Storage::exists('backup/'.$backup->file)) {
            \Storage::delete('backup/'.$backup->file);
        }

        $this->repo->delete($backup);

        return $this->success(['message' => trans('utility.backup_deleted')]);
    }
}
