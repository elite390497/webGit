<?php

namespace App\Http\Controllers\Resource;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Resource\Syllabus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Resource\SyllabusRequest;
use App\Repositories\Resource\SyllabusRepository;
use App\Repositories\Upload\UploadRepository;

class SyllabusController extends Controller
{
    protected $request;
    protected $repo;
    protected $upload;
    protected $module = 'syllabus';

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        SyllabusRepository $repo,
        UploadRepository $upload
    ) {
        $this->request = $request;
        $this->repo = $repo;
        $this->upload = $upload;

        $this->middleware('academic.session.set')->except('download');
    }

    /**
     * Used to get pre requisites
     * @get ("/api/syllabus/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', Syllabus::class);

        return $this->success($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Syllabuss
     * @get ("/api/syllabus")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', Syllabus::class);

        $syllabuses = $this->repo->paginate($this->request->all());

        $filters = $this->repo->getFilters();

        return $this->success(compact('syllabuses', 'filters'));
    }

    /**
     * Used to print all Syllabuss
     * @post ("/api/syllabus/print")
     * @return Response
     */
    public function print()
    {
        $syllabuses = $this->repo->print(request('filter'));

        return view('print.resource.syllabus', compact('syllabuses'))->render();
    }

    /**
     * Used to generate pdf all Syllabuss
     * @post ("/api/syllabus/pdf")
     * @return Response
     */
    public function pdf()
    {
        $syllabuses = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.resource.syllabus', compact('syllabuses'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Syllabus
     * @post ("/api/syllabus")
     * @param ({
     *      @Parameter("subject_id", type="integer", required="true", description="Subject of Syllabus")
     * })
     * @return Response
     */
    public function store(SyllabusRequest $request)
    {
        $this->authorize('create', Syllabus::class);

        $syllabus = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('resource.syllabus_added')]);
    }

    /**
     * Used to get Syllabus detail
     * @get ("/api/syllabus/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Syllabus"),
     * })
     * @return Response
     */
    public function show($uuid)
    {
        $syllabus = $this->repo->findByUuidOrFail($uuid);

        $this->repo->isAccessible($syllabus);

        $attachments = $this->upload->getAttachment($this->module, $syllabus->id);

        return $this->success(compact('syllabus', 'attachments'));
    }

    /**
     * Used to print Syllabus detail
     * @get ("/resource/syllabus/{uuid}/print")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Lesson Plan"),
     * })
     * @return Response
     */
    public function printSyllabus($uuid)
    {
        $syllabus = $this->repo->findByUuidOrFail($uuid);

        $this->repo->isAccessible($syllabus);

        return view('print.resource.selected-syllabus', compact('syllabus'));
    }

    /**
     * Used to update Syllabus
     * @patch ("/api/syllabus/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Syllabus"),
     *      @Parameter("subject_id", type="integer", required="true", description="Subject of Syllabus")
     * })
     * @return Response
     */
    public function update($uuid, SyllabusRequest $request)
    {
        $this->authorize('update', Syllabus::class);

        $syllabus = $this->repo->findByUuidOrFail($uuid);

        $this->repo->isAccessible($syllabus);

        $syllabus = $this->repo->update($syllabus, $this->request->all());

        return $this->success(['message' => trans('resource.syllabus_updated')]);
    }

    /**
     * Used to delete Syllabus
     * @delete ("/api/syllabus/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Syllabus"),
     * })
     * @return Response
     */
    public function destroy($uuid)
    {
        $this->authorize('delete', Syllabus::class);

        $syllabus = $this->repo->findByUuidOrFail($uuid);

        $this->repo->isAccessible($syllabus);

        $this->upload->delete($this->module, $syllabus->id);

        $this->repo->delete($syllabus);

        return $this->success(['message' => trans('resource.syllabus_deleted')]);
    }

    /**
     * Used to download Syllabus Attachments
     * @get ("/resource/syllabus/{uuid}/attachment/{attachment_uuid}/download")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Syllabus"),
     *      @Parameter("attachment_uuid", type="string", required="true", description="Unique Id of Attachment"),
     * })
     * @return Response download
     */
    public function download($uuid, $attachment_uuid)
    {
        $syllabus = $this->repo->findByUuidOrFail($uuid);

        $this->repo->isAccessible($syllabus);

        $attachment = $this->upload->getAttachment($this->module, $syllabus->id, $attachment_uuid);

        if (! \Storage::exists($attachment->filename)) {
            return view('errors.file-not-found');
        }

        $download_path = storage_path('app/'.$attachment->filename);
        return response()->download($download_path, $attachment->user_filename);
    }
}
