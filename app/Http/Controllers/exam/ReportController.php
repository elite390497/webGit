<?php

namespace App\Http\Controllers\Exam;

use App\Models\Exam\Record;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\Exam\ReportRepository;

class ReportController extends Controller
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
        ReportRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('academic.session.set');
    }

    /**
     * Used to get pre requisites
     * @get ("/api/exam/report/pre-requisite")
     * 
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('report', Record::class);

        return $this->ok($this->repo->getPreRequisite());
    }

    /**
     * Get students of given batch
     * @post ("/api/exam/report/student")
     * @return Response
     */
    public function getStudents()
    {
        $this->authorize('report', Record::class);

        return $this->ok($this->repo->getStudents($this->request->all()));
    }

    /**
     * Used to get exam reports
     * @post ("/api/exam/report")
     * 
     * @return Response
     */
    public function getReport()
    {
        $this->authorize('report', Record::class);

        $data = $this->repo->getReport($this->request->all());
        
        $summary = gv($data, 'summary');

        $student_record = gv($data, 'student_record');
        $print_options = array('no_border' => true, 'margin_before_signature' => "40px");

        return view('print.exam.report', compact('student_record','summary','print_options'));
    }

    /**
     * Used to get exam reports
     * @post ("/exam/report-card/{batch_id}/print")
     * 
     * @return Response
     */
    public function printReportCard($batch_id)
    {
        $this->authorize('report', Record::class);

        $data = $this->repo->getAllReport(array(
            'batch_id' => $batch_id,
            'type' => request('type')
        ));
        
        $summary = gv($data, 'summary');

        $student_records = gv($data, 'student_records');
        $print_options = array('no_border' => true);
        // $print_options = array('no_border' => true, 'margin_before_signature' => "40px");

        return view('print.exam.all_report', compact('student_records','summary','print_options'));
    }

    /**
     * Used to generate pdf of result
     * @post ("/api/exam/report/pdf")
     * @return Response
     */
    public function getPDFReport()
    {
        $this->authorize('report', Record::class);

        $data = $this->repo->getReport($this->request->all());
        
        $summary = gv($data, 'summary');
        $student_record = gv($data, 'student_record');
        $print_options = array('no_border' => true, 'margin_before_signature' => "140px");

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.exam.report', compact('student_record','summary','print_options'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to get topper list
     * @post ("/api/exam/report/topper")
     * @return Reponse
     */
    public function topperReport()
    {
        $this->authorize('report', Record::class);

        $data = $this->repo->topperReport($this->request->all());
        $print_options = array('no_border' => true, 'full_width' => true);

        return view('print.exam.topper_report', compact('data', 'print_options'));
    }

    /**
     * Used to get student exam report
     * @param  string $uuid
     * @param  integer $record_id
     * @return array
     */
    public function studentExamReport($uuid, $record_id)
    {
        $this->authorize('report', Record::class);

        return $this->ok($this->repo->studentExamReport($uuid, $record_id));
    }

    /**
     * Used to get exam wise consolidated list
     * @post ("/api/exam/report/exam-wise")
     * @return Reponse
     */
    public function examWiseReport()
    {
        $this->authorize('report', Record::class);

        $data = $this->repo->examWiseReport($this->request->all());
        $print_options = array('no_border' => true);

        return view('print.exam.exam_wise_report', compact('data', 'print_options'));
    }

    /**
     * Used to get term wise consolidated list
     * @post ("/api/exam/report/term-wise")
     * @return Reponse
     */
    public function termWiseReport()
    {
        $this->authorize('report', Record::class);

        $data = $this->repo->termWiseReport($this->request->all());

        $print_options = array('no_border' => true);

        return view('print.exam.term_wise_report', compact('data', 'print_options'));
    }
}