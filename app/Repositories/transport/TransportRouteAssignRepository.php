<?php
namespace App\Repositories\Transport;

use App\Models\Student\StudentRecord;
use App\Models\Transport\TransportRoute;
use App\Repositories\Academic\BatchRepository;
use Illuminate\Validation\ValidationException;
use App\Models\Transport\TransportRouteStudent;
use App\Repositories\Configuration\Academic\CourseGroupRepository;

class TransportRouteAssignRepository
{
    protected $transport_route;
    protected $transport_route_student;
    protected $course_group;
    protected $batch;
    protected $student_record;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        TransportRoute $transport_route,
        TransportRouteStudent $transport_route_student,
        CourseGroupRepository $course_group,
        BatchRepository $batch,
        StudentRecord $student_record
    ) {
        $this->transport_route = $transport_route;
        $this->transport_route_student = $transport_route_student;
        $this->course_group = $course_group;
        $this->batch = $batch;
        $this->student_record = $student_record;
    }

    /**
     * Get pre requisite.
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        $batches = $this->course_group->getBatchOption();
        $transport_routes = $this->transport_route->with('transportRouteDetails','transportRouteDetails.transportStoppage')->filterBySession()->get();

        return compact('batches', 'transport_routes');
    }

    /**
     * Fetch batch wise student
     * @param  array  $params
     * @return array
     */
    public function fetchStudent($params = array())
    {
        $batch_id = gv($params, 'batch_id');

        $batch = $this->batch->findOrFail($batch_id);

        $student_records = $this->student_record->with('student', 'student.parent', 'admission', 'transportRouteStudent', 'transportRouteStudent.transportRouteDetail', 'transportRouteStudent.transportRouteDetail.transportStoppage')->filterBySession()->filterByBatchId($batch->id)->whereNull('date_of_exit')->get();

        return compact('student_records', 'batch');
    }

    /**
     * Store transport route of students of given batch
     *
     * @param Array $params
     * @return null
     */
    public function store($params = array())
    {
        $batch_id = gv($params, 'batch_id');

        $batch = $this->batch->findOrFail($batch_id);

        $students = gv($params, 'students', []);

        if (! $students) {
            throw ValidationException::withMessages(['message' => trans('student.could_not_find')]);
        }

        $student_record_ids = $this->student_record->with('student', 'student.parent', 'admission')->filterBySession()->filterByBatchId($batch_id)->whereNull('date_of_exit')->get()->pluck('id')->all();

        beginTransaction();
            foreach ($students as $index => $student) {
                $student_record_id = gv($student, 'id');

                if (! in_array($student_record_id, $student_record_ids)) {
                    throw ValidationException::withMessages(['message' => trans('student.could_not_find')]);
                }

                $no_transport = gbv($student, 'no_transport');

                if ($no_transport) {
                    $this->transport_route_student->where('student_record_id', $student_record_id)->delete();
                } else {
                    $transport_route_detail = gv($student, 'transport_route_detail');

                    if (! $transport_route_detail) {
                        throw ValidationException::withMessages(['message' => trans('transport.could_not_find_stoppage')]);
                    }
                    $transport_route_detail_id = gv($transport_route_detail, 'id');

                    $transport_route_student = $this->transport_route_student->firstOrCreate([
                        'student_record_id' => $student_record_id
                    ]);

                    $transport_route_student->transport_route_detail_id = $transport_route_detail_id;
                    $transport_route_student->save();
                }
            }
        commitTransaction();
    }
}