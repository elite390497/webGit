<?php
namespace App\Repositories\Student;

use Illuminate\Support\Str;
use App\Traits\CollectionPaginator;
use App\Models\Student\Student;
use App\Models\Student\StudentRecord;
use App\Repositories\Configuration\Academic\CourseGroupRepository;

class ReportRepository
{
    use CollectionPaginator;

    protected $student_record;
    protected $student;
    protected $course_group;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        StudentRecord $student_record,
        Student $student,
        CourseGroupRepository $course_group
    ) {
        $this->student_record = $student_record;
        $this->student = $student;
        $this->course_group = $course_group;
    }

    /**
     * Get terminated student's filtered data
     *
     * @param array $params
     * @return StudentRecord
     */
    public function getData($params)
    {
        $sort_by              = gv($params, 'sort_by', 'name');
        $order                = gv($params, 'order', 'asc');
        $batch_id             = gv($params, 'batch_id');
        $first_name           = gv($params, 'first_name');
        $last_name            = gv($params, 'last_name');
        $first_guardian_name  = gv($params, 'father_name');
        $second_guardian_name = gv($params, 'mother_name');

        $date_of_admission_start_date = gv($params, 'date_of_admission_start_date');
        $date_of_admission_end_date   = gv($params, 'date_of_admission_end_date');

        $batch_id = is_array($batch_id) ? $batch_id : ($batch_id ? explode(',', $batch_id) : []);

        $student_parent_id = $this->student->groupBy('student_parent_id')->havingRaw('COUNT(*) > 1')->pluck('student_parent_id');

        $query = $this->student_record->with('student', 'student.parent', 'admission', 'batch', 'batch.course')->filterBySession()->whereNull('date_of_exit')->filterByBatchesId($batch_id)->whereHas('student', function ($q) use($student_parent_id) {
            $q->whereIn('student_parent_id', $student_parent_id);
        });
        
        if ($first_name || $last_name) {
            $query->whereHas('student', function($q) use($first_name, $last_name) {
                $q->filterByFirstName($first_name)->filterByLastName($last_name);
            });
        }

        if ($first_guardian_name || $second_guardian_name) {
            $query->whereHas('student', function($q) use($first_guardian_name, $second_guardian_name) {
                $q->whereHas('parent', function($q1) use($first_guardian_name, $second_guardian_name) {
                    $q1->filterByFirstGuardianName($first_guardian_name)->filterBySecondGuardianName($second_guardian_name);
                });
            });
        }

        if ($date_of_admission_start_date || $date_of_admission_end_date) {
            $query->DateOfAdmissionBetween([
                'start_date' => $date_of_admission_start_date,
                'end_date' => $date_of_admission_end_date
            ]);
        }

        // $query->havingRaw('count(*) > 0');
        // whereRaw('count(*) > 1')
        // where(DB::raw('Count(*)'), '>', 1)
        
        $i = 1;
        $list = array();

        foreach ($query->get() as $student_record) {

            $list[] = array(
                'sno'                 => $i,
                'admission_number'    => $student_record->admission->number,
                'name'                => $student_record->student->name,
                'father_name'         => $student_record->student->parent->first_guardian_name,
                'mother_name'         => $student_record->student->parent->second_guardian_name,
                'batch'               => $student_record->batch->course->name.' '.$student_record->batch->name,
                // 'contact_number'      => $student_record->student->contact_number,
                'date_of_admission'   => $student_record->admission->date_of_admission
            );
            $i++;
        }

        array_multisort(array_map(function($element) use($sort_by) {
            return $element[$sort_by];
        }, $list), $order == 'asc' ? SORT_ASC : SORT_DESC, $list);

        return $list;
    }

    /**
     * Paginate terminated student records using given params.
     *
     * @param array $params
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function paginate($params)
    {
        $page = gv($params, 'page', 1);

        $page_length = gv($params, 'page_length', config('config.page_length'));

        $list = $this->getData($params);

        return $this->collectionPaginate($list, $page_length, $page);
    }

    /**
     * Get terminated student filtered data for printing
     *
     * @param array $params
     * @return StudentRecord
     */
    public function print($params)
    {
        return $this->getData($params);
    }

    /**
     * Get student record filters.
     *
     * @return Array
     */
    public function getFilters()
    {
        $batches = $this->course_group->getBatchOption();

        return compact('batches');
    }
}
