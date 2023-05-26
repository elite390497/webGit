<?php
namespace App\Repositories\Calendar;

use Carbon\Carbon;
use App\Models\Calendar\Holiday;
use Illuminate\Validation\ValidationException;

class HolidayRepository
{
    protected $holiday;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Holiday $holiday
    ) {
        $this->holiday = $holiday;
    }

    /**
     * Get holiday query
     *
     * @return Holiday query
     */
    public function getQuery()
    {
        return $this->holiday;
    }

    /**
     * Count holiday
     *
     * @return integer
     */
    public function count()
    {
        return $this->holiday->filterBySession()->count();
    }

    /**
     * List all holidays by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->holiday->filterBySession()->get()->pluck('date', 'id')->all();
    }

    /**
     * List all holidays by dates
     *
     * @return array
     */
    public function listDate()
    {
        return $this->holiday->filterBySession()->get()->pluck('date')->all();
    }

    /**
     * Get all holidays
     *
     * @return array
     */
    public function getAll()
    {
        return $this->holiday->all();
    }

    /**
     * Find holiday with given id.
     *
     * @param integer $id
     * @return Holiday
     */
    public function find($id)
    {
        return $this->holiday-filterBySession()->filterById($id)->first();
    }

    /**
     * Find holiday with given id or throw an error.
     *
     * @param integer $id
     * @return Holiday
     */
    public function findOrFail($id, $field = 'message')
    {
        $holiday = $this->holiday->filterBySession()->filterById($id)->first();

        if (! $holiday) {
            throw ValidationException::withMessages([$field => trans('calendar.could_not_find_holiday')]);
        }

        return $holiday;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return Holiday
     */
    public function getData($params)
    {
        $sort_by   = gv($params, 'sort_by', 'date');
        $order     = gv($params, 'order', 'desc');
        $keyword     = gv($params, 'keyword');
        $upcoming = gbv($params, 'upcoming');

        $date_start_date = gv($params, 'date_start_date');
        $date_end_date   = gv($params, 'date_end_date');

        $query = $this->holiday->filterBySession()->filterByKeyword($keyword)->dateBetween([
                'start_date' => $date_start_date,
                'end_date' => $date_end_date
            ])->when($upcoming, function ($query1, $upcoming) {
                return $query1->where('date', '>=', date('Y-m-d'));
            });

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all holidays using given params.
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
     * @return Holiday
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get existing holiday for selected session.
     *
     * @return Array
     */
    public function getExistingHolidays()
    {
        return $this->holiday->filterBySession()->get()->pluck('date')->all();
    }

    /**
     * Create holidays.
     *
     * @param array $params
     * @return Holiday
     */
    public function create($params)
    {
        $dates = gv($params, 'dates', []);

        $new_dates = array();
        foreach ($dates as $date) {
            $date = toDate($date);
            $new_dates[] = $date;
            if (! validateDate($date)) {
                throw ValidationException::withMessages(['dates' => trans('calendar.not_a_valid_date', ['date' => showDate($date)])]);
            }

            if (! dateBetweenSession($date)) {
                throw ValidationException::withMessages(['dates' => trans('calendar.not_in_academic_session_range', ['date' => showDate($date)])]);
            }
        }

        $existing_holidays = $this->holiday->whereIn('date', $new_dates)->get()->pluck('date')->all();

        $remaining_holidays = array_diff($dates, $existing_holidays);

        $this->holiday->whereIn('date', $new_dates)->update(['description' => gv($params, 'description')]);

        $new_holidays = array();
        foreach ($remaining_holidays as $date) {
            $new_holidays[] = array(
                'date' => toDate($date),
                'description' => gv($params, 'description'),
                'created_at' => now()
            );
        }

        $this->holiday->insert($new_holidays);
    }

    /**
     * Update given holiday.
     *
     * @param Holiday $holiday
     * @param array $params
     *
     * @return Holiday
     */
    public function update(Holiday $holiday, $params)
    {
        $date = toDate(gv($params, 'date'));
        $description = gv($params, 'description');

        if ($this->holiday->where('id', '!=', $holiday->id)->filterByDate($date)->count()) {
            throw ValidationException::withMessages(['date' => trans('calendar.already_marked_as_holiday', ['date' => showDate($date)])]);
        }

        $holiday->date = toDate($date);
        $holiday->description = $description;
        $holiday->options = array();
        $holiday->save();

        return $holiday;
    }

    /**
     * Delete holiday.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(Holiday $holiday)
    {
        return $holiday->delete();
    }

    /**
     * Delete multiple holidays.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->holiday->whereIn('id', $ids)->delete();
    }
}
