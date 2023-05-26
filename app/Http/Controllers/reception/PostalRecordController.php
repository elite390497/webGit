<?php

namespace App\Http\Controllers\Reception;

use App\Http\Controllers\Controller;
use App\Http\Requests\Reception\PostalRecordRequest;
use App\Models\Reception\PostalRecord;
use App\Repositories\Reception\PostalRecordRepository;
use App\Repositories\Upload\UploadRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PostalRecordController extends Controller
{
    protected $request;
    protected $repo;
    protected $upload;
    protected $module = 'postal_record';

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        PostalRecordRepository $repo,
        UploadRepository $upload
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('academic.session.set');
        $this->upload = $upload;
    }

    /**
     * Used to get pre requisites
     * @get ("/api/reception/postal/record/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', PostalRecord::class);

        return $this->success($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Postal Records
     * @get ("/api/reception/postal/record")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', PostalRecord::class);

        $postal_records = $this->repo->paginate($this->request->all());

        $filters = $this->repo->getFilters();

        return $this->success(compact('postal_records', 'filters'));
    }

    /**
     * Used to print all Postal Records
     * @post ("/api/reception/postal/record/print")
     * @return Response
     */
    public function print()
    {
        $postal_records = $this->repo->print(request('filter'));

        return view('print.reception.postal-record', compact('postal_records'))->render();
    }

    /**
     * Used to generate pdf all Postal Records
     * @post ("/api/reception/postal/record/pdf")
     * @return Response
     */
    public function pdf()
    {
        $postal_records = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.reception.postal-record', compact('postal_records'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Postal Record
     * @post ("/api/reception/postal/record")
     * @param ({
     *      @Parameter("description", type="text", required="optional", description="Description of Postal Record")
     * })
     * @return Response
     */
    public function store(PostalRecordRequest $request)
    {
        $this->authorize('create', PostalRecord::class);

        $postal_record = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('reception.postal_record_added')]);
    }

    /**
     * Used to get Postal Record detail
     * @get ("/api/reception/postal/record/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Postal Record"),
     * })
     * @return Response
     */
    public function show($uuid)
    {
        $this->authorize('list', PostalRecord::class);

        $postal_record = $this->repo->findByUuidOrFail($uuid);

        $this->repo->isAccessible($postal_record);

        $attachments = $this->upload->getAttachment($this->module, $postal_record->id);

        return $this->success(compact('postal_record','attachments'));
    }

    /**
     * Used to update Postal Record
     * @patch ("/api/reception/postal/record/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Postal Record"),
     *      @Parameter("dates", type="array", required="true", description="Array of Dates"),
     *      @Parameter("description", type="text", required="optional", description="Description of Postal Record")
     * })
     * @return Response
     */
    public function update($uuid, PostalRecordRequest $request)
    {
        $this->authorize('update', PostalRecord::class);

        $postal_record = $this->repo->findByUuidOrFail($uuid);

        $postal_record = $this->repo->update($postal_record, $this->request->all());

        return $this->success(['message' => trans('reception.postal_record_updated')]);
    }

    /**
     * Used to delete Postal Record
     * @delete ("/api/reception/postal/record/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Postal Record"),
     * })
     * @return Response
     */
    public function destroy($uuid)
    {
        $this->authorize('delete', PostalRecord::class);

        $postal_record = $this->repo->findByUuidOrFail($uuid);

        $this->upload->delete($this->module, $postal_record->id);

        $this->repo->delete($postal_record);

        return $this->success(['message' => trans('reception.postal_record_deleted')]);
    }

    /**
     * Used to download Postal Record Attachments
     * @get ("/reception/postal/record/{uuid}/attachment/{attachment_uuid}/download")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Postal Record"),
     *      @Parameter("attachment_uuid", type="string", required="true", description="Unique Id of Attachment"),
     * })
     * @return Response download
     */
    public function download($uuid, $attachment_uuid)
    {
        $postal_record = $this->repo->findByUuidOrFail($uuid);

        $this->repo->isAccessible($postal_record);

        $attachment = $this->upload->getAttachment($this->module, $postal_record->id, $attachment_uuid);

        if (! \Storage::exists($attachment->filename)) {
            return view('errors.file-not-found');
        }

        $download_path = storage_path('app/'.$attachment->filename);
        return response()->download($download_path, $attachment->user_filename);
    }
}