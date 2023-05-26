<?php

namespace App\Http\Controllers\Frontend;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Frontend\Page;
use App\Http\Controllers\Controller;
use App\Http\Requests\Frontend\PageRequest;
use App\Repositories\Frontend\PageRepository;
use App\Repositories\Upload\UploadRepository;

class PageController extends Controller
{
    protected $request;
    protected $repo;
    protected $upload;
    protected $module = 'frontend-page';

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        PageRepository $repo,
        UploadRepository $upload
    ) {
        $this->request = $request;
        $this->repo = $repo;
        $this->upload = $upload;

        $this->middleware('frontend.website.enabled');
        $this->middleware('permission:configure-frontend')->except(['show','download']);
    }

    /**
     * Used to get all Pages
     * @get ("/api/frontend/page")
     * @return Response
     */
    public function index()
    {
        $pages = $this->repo->paginate($this->request->all());

        return $this->success(compact('pages'));
    }

    /**
     * Used to print all Pages
     * @frontend ("/api/frontend/page/print")
     * @return Response
     */
    public function print()
    {
        $pages = $this->repo->print();

        return view('print.frontend.page', compact('pages'))->render();
    }

    /**
     * Used to generate pdf all Pages
     * @frontend ("/api/frontend/page/pdf")
     * @return Response
     */
    public function pdf()
    {
        $pages = $this->repo->print();

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.frontend.page', compact('pages'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Page
     * @frontend ("/api/frontend/page")
     * @param ({
     *      @Parameter("title", type="string", required="true", description="Title of Page"),
     *      @Parameter("body", type="text", required="true", description="Body of Page"),
     *      @Parameter("is_draft", type="boolean", required="true", description="Is page draft?")
     * })
     * @return Response
     */
    public function store(PageRequest $request)
    {
        $page = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('frontend.page_added')]);
    }

    /**
     * Used to get Page detail
     * @get ("/api/frontend/page/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Page"),
     * })
     * @return Response
     */
    public function show($uuid)
    {
        $page = $this->repo->findByUuidOrFail($uuid);

        $this->repo->isAccessible($page);

        $attachments = $this->upload->getAttachment($this->module, $page->id);

        return $this->success(compact('page', 'attachments'));
    }

    /**
     * Used to update Page
     * @patch ("/api/frontend/page/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Page"),
     *      @Parameter("title", type="string", required="true", description="Title of Page"),
     *      @Parameter("body", type="text", required="true", description="Body of Page"),
     *      @Parameter("is_draft", type="boolean", required="true", description="Is page draft?")
     * })
     * @return Response
     */
    public function update($uuid, PageRequest $request)
    {
        $page = $this->repo->findByUuidOrFail($uuid);

        $page = $this->repo->update($page, $this->request->all());

        return $this->success(['message' => trans('frontend.page_updated')]);
    }

    /**
     * Used to delete Page
     * @delete ("/api/frontend/page/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Page"),
     * })
     * @return Response
     */
    public function destroy($uuid)
    {
        $page = $this->repo->findByUuidOrFail($uuid);

        $this->upload->delete($this->module, $page->id);

        $this->repo->delete($page);

        return $this->success(['message' => trans('frontend.page_deleted')]);
    }

    /**
     * Used to download Page Attachments
     * @get ("/frontend/page/{uuid}/attachment/{attachment_uuid}/download")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Page"),
     *      @Parameter("attachment_uuid", type="string", required="true", description="Unique Id of Attachment"),
     * })
     * @return Response download
     */
    public function download($uuid, $attachment_uuid)
    {
        $page = $this->repo->findByUuidOrFail($uuid);

        $this->repo->isAccessible($page);

        $attachment = $this->upload->getAttachment($this->module, $page->id, $attachment_uuid);

        if (! \Storage::exists($attachment->filename)) {
            return view('errors.file-not-found');
        }

        $download_path = storage_path('app/'.$attachment->filename);
        return response()->download($download_path, $attachment->user_filename);
    }

    /**
     * Used to upload slider image
     * @post ("/api/frontend/page/slider/image")
     * @param ({
     *      @Parameter("image", type="image", required="true", description="Image to be uploaded"),
     * })
     * @return Response
     */
    public function uploadSliderImage()
    {
        $file = \Storage::disk('public')->putFile('frontend-page-slider-image', request()->file('image'));
        $img = \Image::make(\Storage::disk('public')->get($file));
        $height = $img->width();
        if ($height > 1440) {
            $img->resize(1440, null, function ($constraint) {
                $constraint->aspectRatio();
            })->stream();
        } else {
            $img->stream();
        }
        \Storage::disk('public')->put($file, $img);

        return $this->success(['message' => trans('frontend.slider_image_uploaded'),'image' => 'storage/'.$file]);
    }

    /**
     * Used to remove main or sidebar image
     * @delete ("/api/frontend/page/slider/image")
     * @return Response
     */
    public function removeSliderImage()
    {
        return $this->success(['message' => trans('frontend.slider_image_removed')]);
    }
}
