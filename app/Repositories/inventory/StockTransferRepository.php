<?php
namespace App\Repositories\Inventory;

use App\Models\Inventory\StockTransfer;
use App\Models\Inventory\StockTransferDetail;
use App\Models\Inventory\StockTransferReturn;
use App\Repositories\Configuration\Asset\RoomRepository;
use App\Repositories\Employee\EmployeeRepository;
use App\Repositories\Inventory\StockItemRepository;
use App\Repositories\Student\StudentRepository;
use App\Repositories\Upload\UploadRepository;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class StockTransferRepository
{
    protected $stock_transfer;
    protected $stock_transfer_detail;
    protected $stock_item;
    protected $upload;
    protected $room;
    protected $student;
    protected $employee;
    protected $stock_transfer_return;
    protected $module = 'stock_transfer';

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        StockTransfer $stock_transfer,
        StockTransferDetail $stock_transfer_detail,
        StockItemRepository $stock_item,
        UploadRepository $upload,
        RoomRepository $room,
        StudentRepository $student,
        EmployeeRepository $employee,
        StockTransferReturn $stock_transfer_return
    ) {
        $this->stock_transfer = $stock_transfer;
        $this->stock_transfer_detail = $stock_transfer_detail;
        $this->stock_item = $stock_item;
        $this->upload = $upload;
        $this->room = $room;
        $this->student = $student;
        $this->employee = $employee;
        $this->stock_transfer_return = $stock_transfer_return;
    }

    /**
     * Find stock transfer with given id.
     *
     * @param integer $id
     * @return StockTransfer
     */
    public function find($id)
    {
        return $this->stock_transfer->info()->filterBySession()->filterById($id)->first();
    }

    /**
     * Find stock transfer with given id or throw an error.
     *
     * @param integer $id
     * @return StockTransfer
     */
    public function findOrFail($id, $field = 'message')
    {
        $stock_transfer = $this->stock_transfer->info()->filterBySession()->filterById($id)->first();

        if (! $stock_transfer) {
            throw ValidationException::withMessages([$field => trans('inventory.could_not_find_stock_transfer')]);
        }

        return $stock_transfer;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return StockTransfer
     */
    public function getData($params)
    {
        $sort_by = gv($params, 'sort_by', 'date');
        $order   = gv($params, 'order', 'desc');
        $room_id = gv($params, 'room_id');
        $room_id = is_array($room_id) ? $room_id : ($room_id ? explode(',', $room_id) : []);

        $date_start_date = gv($params, 'date_start_date');
        $date_end_date   = gv($params, 'date_end_date');

        $query = $this->stock_transfer->info()->filterBySession()->dateBetween([
            'start_date' => $date_start_date,
            'end_date' => $date_end_date
        ]);

        if (count($room_id)) {
            $query->whereHas('room', function ($q) use ($room_id) {
                $q->whereIn('id', $room_id);
            });
        }

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all stock transfers using given params.
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
     * @return StockTransfer
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get stock transfer filters.
     *
     * @return Array
     */
    public function getFilters()
    {
        return $this->getPreRequisite();
    }

    /**
     * Get pre requisite
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        $stock_items = $this->stock_item->selectAll();
        $rooms = $this->room->selectAll();
        $students = $this->student->selectAll();
        $employees = $this->employee->selectAll();

        return compact('stock_items','rooms','students','employees');
    }

    /**
     * Create a new stock transfer.
     *
     * @param array $params
     * @return StockTransfer
     */
    public function create($params)
    {
        $this->validateInput($params);

        beginTransaction();

        $type = gv($params, 'type');

        $stock_transfer = $this->stock_transfer->forceCreate([
            'type'            => $type,
            'room_id'         => $type == 'room' ? gv($params, 'room_id') : null,
            'student_id'      => $type == 'student' ? gv($params, 'student_id') : null,
            'employee_id'     => $type == 'employee' ? gv($params, 'employee_id') : null,
            'date'            => toDate(gv($params, 'date')),
            'return_due_date' => toDate(gv($params, 'return_due_date')),
            'description'     => gv($params, 'description'),
            'user_id'         => \Auth::user()->id,
            'upload_token'    => gv($params, 'upload_token') ? : Str::uuid(),
            'options'         => []
        ]);

        foreach (gv($params, 'details') as $detail) {
            $stock_transfer_detail = $this->stock_transfer_detail->forceCreate([
                'stock_transfer_id' => $stock_transfer->id,
                'quantity'      => gv($detail, 'quantity', 0),
                'stock_item_id' => gv($detail, 'stock_item_id'),
                'description'   => gv($detail, 'description'),
                'options'       => []
            ]);

            $stock_item = $stock_transfer_detail->item;
            $stock_item->decrement('quantity', $stock_transfer_detail->quantity);
        }
        
        $this->processUpload($stock_transfer, $params);

        commitTransaction();

        return $stock_transfer;
    }

    /**
     * Upload attachment
     *
     * @param StockTransfer $stock_transfer
     * @param array $params
     * @param string $action
     * @return void
     */
    public function processUpload(StockTransfer $stock_transfer, $params = array(), $action = 'create')
    {
        $upload_token = gv($params, 'upload_token');

        if ($action === 'create') {
            $this->upload->store($this->module, $stock_transfer->id, $upload_token);
        } else {
            $this->upload->update($this->module, $stock_transfer->id, $upload_token);
        }
    }

    /**
     * Validate stock transfer input.
     *
     * @param array $params
     * @return void
     */
    public function validateInput($params, $stock_transfer_id = null)
    {
        if (! dateBetweenSession(gv($params, 'date'))) {
            throw ValidationException::withMessages(['date' => trans('academic.invalid_session_date_range')]);
        }

        $type = gv($params, 'type');
        $student_id = gv($params, 'student_id');
        $employee_id = gv($params, 'employee_id');
        $room_id = gv($params, 'room_id');

        if ($type == 'student') {
            $student = $this->student->findorFail($student_id);
        } else if ($type == 'employee') {
            $employee = $this->employee->findorFail($employee_id);
        } else if ($type == 'room') {
            $room = $this->room->findorFail($room_id);
        }

        $details = gv($params, 'details');

        if (! $details) {
            throw ValidationException::withMessages(['message' => trans('inventory.no_item_found')]);
        }

        $stock_item_ids    = $this->stock_item->listId();

        $item_ids = array();
        foreach ($details as $index => $detail) {
            $stock_item_id = gv($detail, 'stock_item_id');
            $quantity      = gv($detail, 'quantity', 0);

            if (! isInteger($quantity) || $quantity <= 0) {
                throw ValidationException::withMessages([$index.'_quantity' => trans('validation.required', ['attribute' => trans('inventory.stock_transfer_quantity')])]);
            }

            if (! in_array($stock_item_id, $stock_item_ids)) {
                throw ValidationException::withMessages([$index.'_stock_item_id' => trans('inventory.could_not_find_stock_item')]);
            }

            $item_ids[] = $stock_item_id;
        }

        if (count($item_ids) > count(array_unique($item_ids))) {
            throw ValidationException::withMessages(['message' => trans('inventory.duplicate_item_found')]);
        }
    }

    /**
     * Update given stock transfer.
     *
     * @param StockTransfer $stock_transfer
     * @param array $params
     *
     * @return StockTransfer
     */
    public function update(StockTransfer $stock_transfer, $params)
    {
        $this->validateInput($params, $stock_transfer->id);

        beginTransaction();

        $type = gv($params, 'type');

        $stock_transfer->type            = $type;
        $stock_transfer->room_id         = $type == 'room' ? gv($params, 'room_id') : null;
        $stock_transfer->student_id      = $type == 'student' ? gv($params, 'student_id') : null;
        $stock_transfer->employee_id     = $type == 'employee' ? gv($params, 'employee_id') : null;
        $stock_transfer->date            = toDate(gv($params, 'date'));
        $stock_transfer->return_due_date = toDate(gv($params, 'return_due_date'));
        $stock_transfer->description     = gv($params, 'description');
        $stock_transfer->save();

        $stock_item_id = array();
        foreach ($params['details'] as $detail) {
            $stock_item_id[] = gv($detail, 'stock_item_id');
        }

        $existing_stock_item_ids = $stock_transfer->details->pluck('stock_item_id')->all();
        foreach ($existing_stock_item_ids as $existing_stock_item_id) {
            if (! in_array($existing_stock_item_id, $stock_item_id)) {
                $stock_transfer_detail = $this->stock_transfer_detail->whereStockItemId($existing_stock_item_id)->first();
                $stock_item = $stock_transfer_detail->item;
                $stock_item->increment('quantity', $stock_transfer_detail->quantity);
                $stock_transfer_detail->delete();
            }
        }

        foreach ($params['details'] as $detail) {
            $stock_transfer_detail = $this->stock_transfer_detail->firstOrCreate([
                'stock_transfer_id' => $stock_transfer->id,
                'stock_item_id' => gv($detail, 'stock_item_id')
            ]);

            $old_quantity = $stock_transfer_detail->quantity ? : 0;

            $stock_transfer_detail->quantity    = gv($detail, 'quantity', 0);
            $stock_transfer_detail->description = gv($detail, 'description');
            $stock_transfer_detail->options     = [];
            $stock_transfer_detail->save();

            if ($old_quantity != $stock_transfer_detail->quantity) {
                $stock_item = $stock_transfer_detail->item;
                $stock_item->increment('quantity', $old_quantity);
                $stock_item->decrement('quantity', $stock_transfer_detail->quantity);
            }
        }

        $this->processUpload($stock_transfer, $params, 'update');

        commitTransaction();
    }

    /**
     * Return item
     * @param  StockTransfer $stock_transfer
     * @param  array $params        
     * @return void
     */
    public function returnItem(StockTransfer $stock_transfer, $params = array())
    {
        $date = gv($params, 'date');
        $quantity = gv($params, 'quantity');
        $description = gv($params, 'description');
        $type = gv($params, 'type');

        if ($date < toDate($stock_transfer->date)) {
            throw ValidationException::withMessages(['date' => trans('inventory.return_date_should_greater_than_equal_to_stock_transfer_date')]);
        }

        $stock_item_id = gv($params, 'stock_item_id');

        $stock_transfer_detail = $stock_transfer->details->where('stock_item_id', $stock_item_id)->first();

        if (! $stock_transfer_detail) {
            throw ValidationException::withMessages(['message' => trans('inventory.could_not_find_stock_item')]);
        }

        $stock_item = $stock_transfer_detail->item;

        $item_return_count = $this->stock_transfer_return->whereStockTransferId($stock_transfer->id)->whereStockItemId($stock_item_id)->sum('quantity');

        if ($stock_transfer_detail->quantity < ($quantity + $item_return_count)) {
            throw ValidationException::withMessages(['message' => trans('inventory.stock_transfer_return_quantity_exceeded')]);
        }

        $this->stock_transfer_return->forceCreate([
            'stock_transfer_id' => $stock_transfer->id,
            'stock_item_id' => $stock_item->id,
            'type' => $type,
            'quantity' => $quantity,
            'description' => $description,
            'date' => toDate($date),
        ]);

        if ($type == 'returned') {
            $stock_item->increment('quantity', $quantity);
        }
    }

    /**
     * Delete stock transfer return.
     *
     * @param StockTransfer $stock_transfer
     * @param integer $id
     * @return bool|null
     */
    public function deleteReturn(StockTransfer $stock_transfer, $id)
    {
        beginTransaction();

        $stock_transfer_return = $this->stock_transfer_return->whereStockTransferId($stock_transfer->id)->whereId($id)->first();

        if (! $stock_transfer_return) {
            throw ValidationException::withMessages(['message' => trans('inventory.could_not_find_stock_transfer_return')]);
        }

        if ($stock_transfer_return->type == 'returned') {
            $stock_item = $stock_transfer_return->item;
            $stock_item->decrement('quantity', $stock_transfer_return->quantity);
        }

        $stock_transfer_return->delete();

        commitTransaction();
    }

    /**
     * Delete stock transfer.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(StockTransfer $stock_transfer)
    {
        beginTransaction();

        foreach ($stock_transfer->details as $detail) {
            $stock_item = $detail->item;
            $stock_item->increment('quantity', $detail->quantity);
        }

        $stock_transfer->delete();

        commitTransaction();
    }

    /**
     * Delete multiple stock transfer.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->stock_transfer->whereIn('id', $ids)->delete();
    }
}