<?php

namespace App\Http\Controllers\Resource;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Resource\Notes;
use App\Http\Controllers\Controller;
use App\Http\Requests\Resource\NotesRequest;
use App\Repositories\Resource\NotesRepository;
use App\Repositories\Upload\UploadRepository;

class NotesController extends Controller
{
    protected $request;
    protected $repo;
    protected $upload;
    protected $module = 'notes';

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        NotesRepository $repo,
        UploadRepository $upload
    ) {
        $this->request = $request;
        $this->repo = $repo;
        $this->upload = $upload;

        $this->middleware('academic.session.set')->except('download');
    }

    /**
     * Used to get pre requisites
     * @get ("/api/notes/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', Notes::class);

        return $this->success($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Notess
     * @get ("/api/notes")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', Notes::class);

        $notes = $this->repo->paginate($this->request->all());

        $filters = $this->repo->getFilters();

        return $this->success(compact('notes', 'filters'));
    }

    /**
     * Used to print all Notess
     * @post ("/api/notes/print")
     * @return Response
     */
    public function print()
    {
        $notes = $this->repo->print(request('filter'));

        return view('print.resource.notes', compact('notes'))->render();
    }

    /**
     * Used to generate pdf all Notess
     * @post ("/api/notes/pdf")
     * @return Response
     */
    public function pdf()
    {
        $notes = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.resource.notes', compact('notes'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Notes
     * @post ("/api/notes")
     * @param ({
     *      @Parameter("title", type="string", required="true", description="Title of Notes"),
     *      @Parameter("subject_id", type="integer", required="true", description="Subject of Notes"),
     *      @Parameter("description", type="text", required="optional", description="Description of Notes")
     * })
     * @return Response
     */
    public function store(NotesRequest $request)
    {
        $this->authorize('create', Notes::class);

        $notes = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('resource.notes_added')]);
    }

    /**
     * Used to get Notes detail
     * @get ("/api/notes/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Notes"),
     * })
     * @return Response
     */
    public function show($uuid)
    {
        $notes = $this->repo->findByUuidOrFail($uuid);

        $this->repo->isAccessible($notes);

        $attachments = $this->upload->getAttachment($this->module, $notes->id);

        return $this->success(compact('notes', 'attachments'));
    }

    /**
     * Used to update Notes
     * @patch ("/api/notes/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Notes"),
     *      @Parameter("title", type="string", required="true", description="Title of Notes"),
     *      @Parameter("subject_id", type="integer", required="true", description="Subject of Notes"),
     *      @Parameter("description", type="text", required="optional", description="Description of Notes")
     * })
     * @return Response
     */
    public function update($uuid, NotesRequest $request)
    {
        $this->authorize('update', Notes::class);

        $notes = $this->repo->findByUuidOrFail($uuid);

        $this->repo->isAccessible($notes);

        $notes = $this->repo->update($notes, $this->request->all());

        return $this->success(['message' => trans('resource.notes_updated')]);
    }

    /**
     * Used to delete Notes
     * @delete ("/api/notes/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Notes"),
     * })
     * @return Response
     */
    public function destroy($uuid)
    {
        $this->authorize('delete', Notes::class);

        $notes = $this->repo->findByUuidOrFail($uuid);

        $this->repo->isAccessible($notes);

        $this->upload->delete($this->module, $notes->id);

        $this->repo->delete($notes);

        return $this->success(['message' => trans('resource.notes_deleted')]);
    }

    /**
     * Used to download Notes Attachments
     * @get ("/resource/notes/{uuid}/attachment/{attachment_uuid}/download")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Notes"),
     *      @Parameter("attachment_uuid", type="string", required="true", description="Unique Id of Attachment"),
     * })
     * @return Response download
     */
    public function download($uuid, $attachment_uuid)
    {
        $notes = $this->repo->findByUuidOrFail($uuid);

        $this->repo->isAccessible($notes);

        $attachment = $this->upload->getAttachment($this->module, $notes->id, $attachment_uuid);

        if (! \Storage::exists($attachment->filename)) {
            return view('errors.file-not-found');
        }

        $download_path = storage_path('app/'.$attachment->filename);
        return response()->download($download_path, $attachment->user_filename);
    }
}
