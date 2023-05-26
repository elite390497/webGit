<?php
namespace App\Repositories\Reception;

use Illuminate\Support\Str;
use App\Models\Reception\VisitorMessage;
use App\Notifications\Contact;
use Illuminate\Validation\ValidationException;

class VisitorMessageRepository
{
    protected $visitor_message;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        VisitorMessage $visitor_message
    ) {
        $this->visitor_message = $visitor_message;
    }

    /**
     * Get visitor message query
     *
     * @return Visitor Message query
     */
    public function getQuery()
    {
        return $this->visitor_message;
    }

    /**
     * Count Visitor Message
     *
     * @return integer
     */
    public function count()
    {
        return $this->visitor_message->count();
    }

    /**
     * List all visitor message by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->visitor_message->get()->pluck('name', 'id')->all();
    }

    /**
     * Get all contacts
     *
     * @return array
     */
    public function getAll()
    {
        return $this->visitor_message->all();
    }

    /**
     * Find visitor message with given id.
     *
     * @param integer $id
     * @return Visitor Message
     */
    public function find($id)
    {
        return $this->visitor_message->filterById($id)->first();
    }

    /**
     * Find visitor message with given id or throw an error.
     *
     * @param integer $id
     * @return Visitor Message
     */
    public function findOrFail($id, $field = 'message')
    {
        $visitor_message = $this->visitor_message->filterById($id)->first();

        if (! $visitor_message) {
            throw ValidationException::withMessages([$field => trans('reception.could_not_find_visitor_message')]);
        }

        return $visitor_message;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return Visitor Message
     */
    public function getData($params)
    {
        $sort_by = gv($params, 'sort_by', 'name');
        $order   = gv($params, 'order', 'asc');
        $name    = gv($params, 'name');
        $email   = gv($params, 'email');

        $date_start_date = gv($params, 'date_start_date');
        $date_end_date   = gv($params, 'date_end_date');
        
        return $this->visitor_message->filterByName($name)->filterByEmail($email)->dateBetween([
            'start_date' => $date_start_date,
            'end_date' => $date_end_date
        ])->orderBy($sort_by, $order);
    }

    /**
     * Paginate all visitor message using given params.
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
     * @return Visitor Message
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Create a new contact.
     *
     * @param array $params
     * @return Visitor Message
     */
    public function create($params)
    {
        $visitor_message = $this->visitor_message->forceCreate($this->formatParams($params));

        (new \App\User)->forceFill([
            'email' => config('config.email'),
        ])->notify(new Contact($visitor_message));

        return $visitor_message;
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $visitor_message_id = null)
    {
        $formatted = [
            'name'           => gv($params, 'name'),
            'email'          => gv($params, 'email'),
            'contact_number' => gv($params, 'contact_number'),
            'subject'        => gv($params, 'subject'),
            'message'        => gv($params, 'message')
        ];

        $options['ip'] = getClientIp();
        $options['user_agent'] = \Request::header('User-Agent');

        $formatted['options'] = $options;

        return $formatted;
    }

    /**
     * Delete contact.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(VisitorMessage $visitor_message)
    {
        return $visitor_message->delete();
    }

    /**
     * Delete multiple contact.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->visitor_message->whereIn('id', $ids)->delete();
    }
}
