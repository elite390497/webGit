<?php

namespace App\Http\Controllers\Exam;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Exam\Record;
use App\Http\Requests\Exam\RecordRequest;
use App\Repositories\Exam\RecordRepository;

class RecordController extends Controller
{
    protected $request;
    protected $repo;

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        RecordRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('academic.session.set');
    }

    /**
     * Used to get pre requisites
     * @get ("/api/exam/record/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', Record::class);

        return $this->ok($this->repo->getPreRequisite());
    }

    /**
     * Used to get record observation pre requisites
     * @get ("/api/exam/record/observation/pre-requisite")
     * @return Response
     */
    public function observationPreRequisite()
    {
        $this->authorize('preRequisite', Record::class);

        return $this->ok($this->repo->getObservationPreRequisite());
    }

    /**
     * Get students for record entry
     * @post ("/api/exam/record/student")
     * @return Response
     */
    public function getStudents()
    {
        $this->authorize('preRequisite', Record::class);

        return $this->ok($this->repo->getStudents($this->request->all()));
    }

    /**
     * Get students for observation record entry
     * @post ("/api/exam/record/observation/student")
     * @return Response
     */
    public function getStudentsForObservationRecord()
    {
        $this->authorize('preRequisite', Record::class);

        return $this->ok($this->repo->getStudentsForObservationRecord($this->request->all()));
    }

    /**
     * Store exam record
     * @post ("/api/exam/record")
     * @return Response
     */
    public function store()
    {
        $this->authorize('store', Record::class);

        $exam_record = $this->repo->store($this->request->all());

        return $this->success(['message' => trans('exam.marks_recorded'), 'exam_record' => $exam_record]);
    }

    /**
     * Store exam observation record
     * @post ("/api/exam/record/observation")
     * @return Response
     */
    public function storeObservation()
    {
        $this->authorize('store', Record::class);

        $exam_schedule = $this->repo->storeObservation($this->request->all());

        return $this->success(['message' => trans('exam.marks_recorded'), 'exam_schedule' => $exam_schedule]);
    }

    /**
     * Used to delete record
     * @post ("/api/exam/record/delete")
     * @return Response
     */
    public function destroy()
    {
        $this->authorize('delete', Record::class);

        $this->repo->deleteRecord($this->request->all());

        return $this->success(['message' => trans('exam.marks_deleted')]);
    }

    /**
     * Used to delete observation record
     * @post ("/api/exam/observation/record/delete")
     * @return Response
     */
    public function destroyObservation()
    {
        $this->authorize('delete', Record::class);

        $this->repo->deleteObservationRecord($this->request->all());

        return $this->success(['message' => trans('exam.marks_deleted')]);
    }
}