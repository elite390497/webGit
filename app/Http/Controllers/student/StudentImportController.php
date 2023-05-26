<?php

namespace App\Http\Controllers\Student;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\Student\StudentImportRepository;

class StudentImportController extends Controller
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
		StudentImportRepository $repo
	)
	{
		$this->request = $request;
		$this->repo = $repo;
	}

    /**
     * Upload file for import
     * @post ("/api/student/import/start")
     * @param ({
     *      @Parameter("file", type="file", required="required", description="File to be uploaded")
     * })
     * @return Response
     */
    public function startImport()
    {	
    	return $this->success($this->repo->startImport($this->request->all()));
    }

    /**
     * Finish import of students
     * @post ("/api/student/import/finish")
     * @param ({
     *      @Parameter("uuid", type="string", required="required", description="Unique Id of File"),
     *      @Parameter("columns", type="array", required="required", description="Array of Column")
     * })
     * @return Response
     */
    public function finishImport()
    {	
    	$this->repo->finishImport($this->request->all());

        return $this->success(['message' => trans('student.imported')]);
    }
}