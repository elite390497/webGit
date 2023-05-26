<?php
namespace App\Repositories\Configuration\Student;

use Illuminate\Validation\ValidationException;
use App\Models\Configuration\Student\StudentGroup;

class StudentGroupRepository
{
    protected $student_group;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        StudentGroup $student_group
    ) {
        $this->student_group = $student_group;
    }

    /**
     * Get student group query
     *
     * @return StudentGroup query
     */
    public function getQuery()
    {
        return $this->student_group;
    }

    /**
     * Count student group
     *
     * @return integer
     */
    public function count()
    {
        return $this->student_group->count();
    }

    /**
     * List all student groups by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->student_group->all()->pluck('name', 'id')->all();
    }

    /**
     * List all student groups by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->student_group->all(['name', 'id']);
    }

    /**
     * List all student groups by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->student_group->all()->pluck('id')->all();
    }

    /**
     * Get all student groups
     *
     * @return array
     */
    public function getAll()
    {
        return $this->student_group->all();
    }

    /**
     * Find student group with given id.
     *
     * @param integer $id
     * @return StudentGroup
     */
    public function find($id)
    {
        return $this->student_group->find($id);
    }

    /**
     * Find student group with given id or throw an error.
     *
     * @param integer $id
     * @return StudentGroup
     */
    public function findOrFail($id)
    {
        $student_group = $this->student_group->find($id);

        if (! $student_group) {
            throw ValidationException::withMessages(['message' => trans('student.could_not_find_student_group')]);
        }

        return $student_group;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return StudentGroup
     */
    public function getData($params)
    {
        $sort_by         = gv($params, 'sort_by', 'name');
        $order           = gv($params, 'order', 'asc');

        return $this->student_group->orderBy($sort_by, $order);
    }

    /**
     * Paginate all student groups using given params.
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
     * @return StudentGroup
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Create a new student group.
     *
     * @param array $params
     * @return StudentGroup
     */
    public function create($params)
    {
        return $this->student_group->forceCreate($this->formatParams($params));
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param integer $student_group_id
     * @return array
     */
    private function formatParams($params, $student_group_id = null)
    {
        $formatted = [
            'name'        => gv($params, 'name'),
            'description' => gv($params, 'description')
        ];

        return $formatted;
    }

    /**
     * Update given student group.
     *
     * @param StudentGroup $student_group
     * @param array $params
     *
     * @return StudentGroup
     */
    public function update(StudentGroup $student_group, $params)
    {
        return $student_group->forceFill($this->formatParams($params, $student_group->id))->save();
    }

    /**
     * Find student group & check it can be deleted or not.
     *
     * @param integer $id
     * @return StudentGroup
     */
    public function deletable($id)
    {
        $student_group = $this->findOrFail($id);

        return $student_group;
    }

    /**
     * Delete student group.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(StudentGroup $student_group)
    {
        return $student_group->delete();
    }

    /**
     * Delete multiple student groups.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->student_group->whereIn('id', $ids)->delete();
    }
}
