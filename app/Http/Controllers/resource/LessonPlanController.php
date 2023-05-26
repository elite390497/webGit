<?php

namespace App\Http\Controllers\Resource;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Resource\LessonPlan;
use App\Http\Controllers\Controller;
use App\Http\Requests\Resource\LessonPlanRequest;
use App\Repositories\Resource\LessonPlanRepository;
use App\Repositories\Upload\UploadRepository;

class LessonPlanController extends Controller
{
    protected $request;
    protected $repo;
    protected $upload;
    protected $module = 'lesson_plan';

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        LessonPlanRepository $repo,
        UploadRepository $upload
    ) {
        $this->request = $request;
        $this->repo = $repo;
        $this->upload = $upload;

        $this->middleware('academic.session.set')->except('download');
    }

    /**
     * Used to get pre requisites
     * @get ("/api/lesson/plan/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', LessonPlan::class);

        return $this->success($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Lesson Plans
     * @get ("/api/lesson/plan")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', LessonPlan::class);

        $lesson_plans = $this->repo->paginate($this->request->all());

        $filters = $this->repo->getFilters();

        return $this->success(compact('lesson_plans', 'filters'));
    }

    /**
     * Used to print all Lesson Plans
     * @post ("/api/lesson/plan/print")
     * @return Response
     */
    public function print()
    {
        $lesson_plans = $this->repo->print(request('filter'));

        return view('print.resource.lesson-plan', compact('lesson_plans'))->render();
    }

    /**
     * Used to generate pdf all Lesson Plans
     * @post ("/api/lesson/plan/pdf")
     * @return Response
     */
    public function pdf()
    {
        $lesson_plans = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.resource.lesson-plan', compact('lesson_plans'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Lesson Plan
     * @post ("/api/lesson_plan")
     * @param ({
     *      @Parameter("start_date", type="date", required="true", description="Start date of Lesson Plan"),
     *      @Parameter("end_date", type="date", required="true", description="End date of Lesson Plan"),
     *      @Parameter("topic", type="string", required="true", description="Topic of Lesson Plan"),
     *      @Parameter("subject_id", type="integer", required="true", description="Subject of Lesson Plan")
     * })
     * @return Response
     */
    public function store(LessonPlanRequest $request)
    {
        $this->authorize('create', LessonPlan::class);

        $lesson_plan = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('resource.lesson_plan_added')]);
    }

    /**
     * Used to get Lesson Plan detail
     * @get ("/api/lesson/plan/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Lesson Plan"),
     * })
     * @return Response
     */
    public function show($uuid)
    {
        $lesson_plan = $this->repo->findByUuidOrFail($uuid);

        $this->repo->isAccessible($lesson_plan);

        $attachments = $this->upload->getAttachment($this->module, $lesson_plan->id);

        return $this->success(compact('lesson_plan', 'attachments'));
    }

    /**
     * Used to print Lesson Plan detail
     * @get ("/resource/lesson/plan/{uuid}/print")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Lesson Plan"),
     * })
     * @return Response
     */
    public function printLessonPlan($uuid)
    {
        $lesson_plan = $this->repo->findByUuidOrFail($uuid);

        $this->repo->isAccessible($lesson_plan);

        return view('print.resource.selected-lesson-plan', compact('lesson_plan'));
    }

    /**
     * Used to update LessonPlan
     * @patch ("/api/lesson/plan/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of LessonPlan"),
     *      @Parameter("start_date", type="date", required="true", description="Start date of Lesson Plan"),
     *      @Parameter("end_date", type="date", required="true", description="End date of Lesson Plan"),
     *      @Parameter("topic", type="string", required="true", description="Topic of Lesson Plan"),
     *      @Parameter("subject_id", type="integer", required="true", description="Subject of Lesson Plan")
     * })
     * @return Response
     */
    public function update($uuid, LessonPlanRequest $request)
    {
        $this->authorize('update', LessonPlan::class);

        $lesson_plan = $this->repo->findByUuidOrFail($uuid);

        $this->repo->isAccessible($lesson_plan);

        $lesson_plan = $this->repo->update($lesson_plan, $this->request->all());

        return $this->success(['message' => trans('resource.lesson_plan_updated')]);
    }

    /**
     * Used to delete LessonPlan
     * @delete ("/api/lesson/plan/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of LessonPlan"),
     * })
     * @return Response
     */
    public function destroy($uuid)
    {
        $this->authorize('delete', LessonPlan::class);

        $lesson_plan = $this->repo->findByUuidOrFail($uuid);

        $this->repo->isAccessible($lesson_plan);

        $this->upload->delete($this->module, $lesson_plan->id);

        $this->repo->delete($lesson_plan);

        return $this->success(['message' => trans('resource.lesson_plan_deleted')]);
    }

    /**
     * Used to download LessonPlan Attachments
     * @get ("/resource/lesson/plan/{uuid}/attachment/{attachment_uuid}/download")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of LessonPlan"),
     *      @Parameter("attachment_uuid", type="string", required="true", description="Unique Id of Attachment"),
     * })
     * @return Response download
     */
    public function download($uuid, $attachment_uuid)
    {
        $lesson_plan = $this->repo->findByUuidOrFail($uuid);

        $this->repo->isAccessible($lesson_plan);

        $attachment = $this->upload->getAttachment($this->module, $lesson_plan->id, $attachment_uuid);

        if (! \Storage::exists($attachment->filename)) {
            return view('errors.file-not-found');
        }

        $download_path = storage_path('app/'.$attachment->filename);
        return response()->download($download_path, $attachment->user_filename);
    }
}
