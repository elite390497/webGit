<?php

namespace App\Http\Controllers\Frontend;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Frontend\Block;
use App\Http\Controllers\Controller;
use App\Http\Requests\Frontend\BlockRequest;
use App\Repositories\Frontend\BlockRepository;
use App\Repositories\Upload\UploadRepository;

class BlockController extends Controller
{
    protected $request;
    protected $repo;
    protected $upload;
    protected $module = 'frontend-block';

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        BlockRepository $repo,
        UploadRepository $upload
    ) {
        $this->request = $request;
        $this->repo = $repo;
        $this->upload = $upload;

        $this->middleware('frontend.website.enabled');
        $this->middleware('permission:configure-frontend')->except(['show','download']);
    }

    /**
     * Used to get pre requisites
     * @get ("/api/frontend/block/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        return $this->success($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Blocks
     * @get ("/api/frontend/block")
     * @return Response
     */
    public function index()
    {
        $blocks = $this->repo->paginate($this->request->all());

        return $this->success(compact('blocks'));
    }

    /**
     * Used to reorder all Blocks
     * @frontend ("/api/frontend/block/reorder")
     * @return Response
     */
    public function reorder()
    {
        $this->repo->reorder($this->request->all());

        return $this->success(['message' => trans('frontend.block_updated')]);
    }

    /**
     * Used to print all Blocks
     * @frontend ("/api/frontend/block/print")
     * @return Response
     */
    public function print()
    {
        $blocks = $this->repo->print();

        return view('print.frontend.block', compact('blocks'))->render();
    }

    /**
     * Used to generate pdf all Blocks
     * @frontend ("/api/frontend/block/pdf")
     * @return Response
     */
    public function pdf()
    {
        $blocks = $this->repo->print();

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.frontend.block', compact('blocks'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Block
     * @frontend ("/api/frontend/block")
     * @param ({
     *      @Parameter("title", type="string", required="true", description="Title of Block"),
     *      @Parameter("slug", type="string", required="true", description="Slug of Block"),
     *      @Parameter("body", type="text", required="true", description="Body of Block"),
     *      @Parameter("is_draft", type="boolean", required="true", description="Is block draft?")
     * })
     * @return Response
     */
    public function store(BlockRequest $request)
    {
        $block = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('frontend.block_added')]);
    }

    /**
     * Used to get Block detail
     * @get ("/api/frontend/block/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Block"),
     * })
     * @return Response
     */
    public function show($uuid)
    {
        $block = $this->repo->findByUuidOrFail($uuid);

        $this->repo->isAccessible($block);

        $attachments = $this->upload->getAttachment($this->module, $block->id);

        return $this->success(compact('block', 'attachments'));
    }

    /**
     * Used to update Block
     * @patch ("/api/frontend/block/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Block"),
     *      @Parameter("title", type="string", required="true", description="Title of Block"),
     *      @Parameter("slug", type="string", required="true", description="Slug of Block"),
     *      @Parameter("body", type="text", required="true", description="Body of Block"),
     *      @Parameter("is_draft", type="boolean", required="true", description="Is block draft?")
     * })
     * @return Response
     */
    public function update($uuid, BlockRequest $request)
    {
        $block = $this->repo->findByUuidOrFail($uuid);

        $block = $this->repo->update($block, $this->request->all());

        return $this->success(['message' => trans('frontend.block_updated')]);
    }

    /**
     * Used to delete Block
     * @delete ("/api/frontend/block/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Block"),
     * })
     * @return Response
     */
    public function destroy($uuid)
    {
        $block = $this->repo->findByUuidOrFail($uuid);

        $this->upload->delete($this->module, $block->id);

        $this->repo->delete($block);

        return $this->success(['message' => trans('frontend.block_deleted')]);
    }

    /**
     * Used to download Block Attachments
     * @get ("/frontend/block/{uuid}/attachment/{attachment_uuid}/download")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Block"),
     *      @Parameter("attachment_uuid", type="string", required="true", description="Unique Id of Attachment"),
     * })
     * @return Response download
     */
    public function download($uuid, $attachment_uuid)
    {
        $block = $this->repo->findByUuidOrFail($uuid);

        $this->repo->isAccessible($block);

        $attachment = $this->upload->getAttachment($this->module, $block->id, $attachment_uuid);

        if (! \Storage::exists($attachment->filename)) {
            return view('errors.file-not-found');
        }

        $download_path = storage_path('app/'.$attachment->filename);
        return response()->download($download_path, $attachment->user_filename);
    }

    /**
     * Used to upload featured image
     * @post ("/api/frontend/block/featured/image")
     * @param ({
     *      @Parameter("image", type="image", required="true", description="Image to be uploaded"),
     * })
     * @return Response
     */
    public function uploadFeaturedImage()
    {
        $file = \Storage::disk('public')->putFile('frontend-block-featured-image', request()->file('image'));
        $img = \Image::make(\Storage::disk('public')->get($file));
        $height = $img->height();
        if ($height > 300) {
            $img->resize(null, 300, function ($constraint) {
                $constraint->aspectRatio();
            })->stream();
        } else {
            $img->stream();
        }
        
        \Storage::disk('public')->put($file, $img);

        return $this->success(['message' => trans('frontend.block_featured_image_uploaded'),'image' => 'storage/'.$file]);
    }

    /**
     * Used to remove main or sidebar image
     * @delete ("/api/frontend/block/featured/image")
     * @return Response
     */
    public function removeFeaturedImage()
    {
        return $this->success(['message' => trans('frontend.block_featured_image_removed')]);
    }
}
