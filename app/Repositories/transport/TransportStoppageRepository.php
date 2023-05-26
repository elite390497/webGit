<?php
namespace App\Repositories\Transport;

use App\Models\Transport\TransportStoppage;
use Illuminate\Validation\ValidationException;

class TransportStoppageRepository
{
    protected $transport_stoppage;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        TransportStoppage $transport_stoppage
    ) {
        $this->transport_stoppage = $transport_stoppage;
    }

    /**
     * Get transport stoppage query
     *
     * @return TransportStoppage query
     */
    public function getQuery()
    {
        return $this->transport_stoppage;
    }

    /**
     * Count transport stoppage
     *
     * @return integer
     */
    public function count()
    {
        return $this->transport_stoppage->filterBySession()->count();
    }

    /**
     * List all transport stoppages by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->transport_stoppage->filterBySession()->get()->pluck('name', 'id')->all();
    }

    /**
     * List all transport stoppages by name & id for select option
     *
     * @return array
     */

    public function selectAll($session_id = null)
    {
        return $this->transport_stoppage->filterBySession($session_id)->get(['name', 'id']);
    }

    /**
     * List all transport stoppages by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->transport_stoppage->filterBySession()->get()->pluck('id')->all();
    }

    /**
     * Get all transport stoppages
     *
     * @return array
     */
    public function getAll()
    {
        return $this->transport_stoppage->filterBySession()->get();
    }

    /**
     * Find transport stoppage with given id.
     *
     * @param integer $id
     * @return TransportStoppage
     */
    public function find($id)
    {
        return $this->transport_stoppage->filterBySession()->filterById($id)->first();
    }

    /**
     * Find transport stoppage with given id or throw an error.
     *
     * @param integer $id
     * @return TransportStoppage
     */
    public function findOrFail($id, $field = 'message')
    {
        $transport_stoppage = $this->transport_stoppage->filterBySession()->filterById($id)->first();

        if (! $transport_stoppage) {
            throw ValidationException::withMessages([$field => trans('transport.could_not_find_stoppage')]);
        }

        return $transport_stoppage;
    }

    /**
     * Find transport stoppage with given id and session or throw an error.
     *
     * @param integer $id
     * @return TransportStoppage
     */
    public function findWithSessionOrFail($id, $session_id = null, $field = 'message')
    {
        $transport_stoppage = $this->transport_stoppage->filterBySession($session_id)->filterById($id)->first();

        if (! $transport_stoppage) {
            throw ValidationException::withMessages([$field => trans('transport.could_not_find_stoppage')]);
        }

        return $transport_stoppage;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return TransportStoppage
     */
    public function getData($params)
    {
        $sort_by             = gv($params, 'sort_by', 'name');
        $order               = gv($params, 'order', 'asc');
        $name                = gv($params, 'name');

        $query = $this->transport_stoppage->filterBySession();

        if ($name) {
            $query->filterByName($name);
        }

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all transport stoppages using given params.
     *
     * @param array $params
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function paginate($params)
    {
        $page_length = gv($params, 'page_length', config('config.page_length'));

        return $this->getData($params)->paginate($page_length);
    }

    /**
     * Get all filtered data for printing
     *
     * @param array $params
     * @return TransportStoppage
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Create a new transport stoppage.
     *
     * @param array $params
     * @return TransportStoppage
     */
    public function create($params)
    {
        return $this->transport_stoppage->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $transport_stoppage_id = null)
    {
        $name = gv($params, 'name');

        $transport_stoppage_exist_query = (! $transport_stoppage_id) ? $this->transport_stoppage : $this->transport_stoppage->where('id', '!=', $transport_stoppage_id);

        $transport_stoppage_exists = $transport_stoppage_exist_query->filterByName($name, 1)->filterBySession()->count();

        if ($transport_stoppage_exists) {
            throw ValidationException::withMessages(['name' => trans('transport.transport_stoppage_exists')]);
        }

        $formatted = [
            'name'                => gv($params, 'name'),
            'description'         => gv($params, 'description')
        ];

        if (! $transport_stoppage_id) {
            $formatted['academic_session_id'] = config('config.default_academic_session.id');
        }

        return $formatted;
    }

    /**
     * Update given transport stoppage.
     *
     * @param TransportStoppage $transport_stoppage
     * @param array $params
     *
     * @return TransportStoppage
     */
    public function update(TransportStoppage $transport_stoppage, $params)
    {
        return $transport_stoppage->forceFill($this->formatParams($params, $transport_stoppage->id))->save();
    }

    /**
     * Find transport stoppage & check it can be deleted or not.
     *
     * @param integer $id
     * @return TransportStoppage
     */
    public function deletable($id)
    {
        $transport_stoppage = $this->findOrFail($id);

        // if ($transport_stoppage->studentFeeRecords()->count()) {
        //     throw ValidationException::withMessages(['message' => trans('transport.stoppage_associated_with_student_fee_record')]);
        // }

        return $transport_stoppage;
    }

    /**
     * Delete transport stoppage.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(TransportStoppage $transport_stoppage)
    {
        return $transport_stoppage->delete();
    }

    /**
     * Delete multiple transport stoppages.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->transport_stoppage->whereIn('id', $ids)->delete();
    }
}
