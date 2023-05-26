<?php

namespace App\Http\Controllers\Student;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Student\StudentRecord;
use App\Http\Requests\Student\PromotionRequest;
use App\Repositories\Student\PromotionRepository;
use App\Http\Requests\Configuration\PermissionRequest;

class PromotionController extends Controller
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
        PromotionRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;
    }

    /**
     * Used to get pre requisites
     * @get ("/api/student/promotion/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('list', StudentRecord::class);

        return $this->success($this->repo->getPreRequisite());
    }

    /**
     * Used to get list of students who awaiting promotion
     * @get ("/api/student/promotion")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', StudentRecord::class);

        $student_records = $this->repo->paginate($this->request->all());

        return $this->success(compact('student_records'));
    }

    /**
     * Used to print list of students who awaiting promotion
     * @post ("/api/students/promotion/print")
     * @return Response
     */
    public function print()
    {
        $this->authorize('list', StudentRecord::class);

        $student_records = $this->repo->print(request('filter'));

        $filter = request('filter');

        return view('print.student.promotion', compact('student_records', 'filter'))->render();
    }

    /**
     * Used to generate pdf of list of students who awaiting promotion
     * @post ("/api/students/promotion/pdf")
     * @return Response
     */
    public function pdf()
    {
        $this->authorize('list', StudentRecord::class);

        $student_records = $this->repo->print(request('filter'));

        $filter = request('filter');

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.student.promotion', compact('student_records', 'filter'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to promote student
     * @post ("/api/student/promote")
     * @return Response
     */
    public function store(PromotionRequest $request)
    {
        $this->authorize('promote', StudentRecord::class);

        $this->repo->store($this->request->all());

        return $this->success(['message' => trans('student.promoted')]);
    }
}
