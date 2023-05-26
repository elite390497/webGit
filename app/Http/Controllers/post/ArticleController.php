<?php

namespace App\Http\Controllers\Post;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Post\Article;
use App\Http\Controllers\Controller;
use App\Http\Requests\Post\ArticleRequest;
use App\Repositories\Post\ArticleRepository;
use App\Repositories\Upload\UploadRepository;

class ArticleController extends Controller
{
    protected $request;
    protected $repo;
    protected $upload;
    protected $module = 'article';

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        ArticleRepository $repo,
        UploadRepository $upload
    ) {
        $this->request = $request;
        $this->repo = $repo;
        $this->upload = $upload;

        $this->middleware('academic.session.set')->except('download');
    }

    /**
     * Used to get pre requisites
     * @get ("/api/article/pre-requisite")
     * @return Response
     */
    public function preRequisite()
    {
        $this->authorize('preRequisite', Article::class);

        return $this->success($this->repo->getPreRequisite());
    }

    /**
     * Used to get all Articles
     * @get ("/api/article")
     * @return Response
     */
    public function index()
    {
        $this->authorize('list', Article::class);

        $articles = $this->repo->paginate($this->request->all());

        $filters = $this->repo->getFilters();

        return $this->success(compact('articles', 'filters'));
    }

    /**
     * Used to print all Articles
     * @post ("/api/article/print")
     * @return Response
     */
    public function print()
    {
        $articles = $this->repo->print(request('filter'));

        return view('print.post.article', compact('articles'))->render();
    }

    /**
     * Used to generate pdf all Articles
     * @post ("/api/article/pdf")
     * @return Response
     */
    public function pdf()
    {
        $articles = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.post.article', compact('articles'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Article
     * @post ("/api/article")
     * @param ({
     *      @Parameter("title", type="string", required="true", description="Title of Article"),
     *      @Parameter("date_of_article", type="date", required="true", description="Date of Article"),
     *      @Parameter("description", type="text", required="optional", description="Description of Article")
     * })
     * @return Response
     */
    public function store(ArticleRequest $request)
    {
        $this->authorize('create', Article::class);

        $article = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('post.article_added')]);
    }

    /**
     * Used to get Article detail
     * @get ("/api/article/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Article"),
     * })
     * @return Response
     */
    public function show($uuid)
    {
        $article = $this->repo->findByUuidOrFail($uuid);

        if (! $article->is_public) {
            $this->authorize('list', Article::class);
        }

        $attachments = $this->upload->getAttachment($this->module, $article->id);

        $is_editable = $this->repo->isEditable($article);

        return $this->success(compact('article', 'attachments','is_editable'));
    }

    /**
     * Used to update Article
     * @patch ("/api/article/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Article"),
     *      @Parameter("title", type="string", required="true", description="Title of Article"),
     *      @Parameter("date_of_article", type="date", required="true", description="Date of Article"),
     *      @Parameter("description", type="text", required="optional", description="Description of Article")
     * })
     * @return Response
     */
    public function update($uuid, ArticleRequest $request)
    {
        $this->authorize('update', Article::class);

        $article = $this->repo->findByUuidOrFail($uuid);

        $article = $this->repo->update($article, $this->request->all());

        return $this->success(['message' => trans('post.article_updated')]);
    }

    /**
     * Used to delete Article
     * @delete ("/api/article/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Article"),
     * })
     * @return Response
     */
    public function destroy($uuid)
    {
        $this->authorize('delete', Article::class);

        $article = $this->repo->findByUuidOrFail($uuid);

        $this->upload->delete($this->module, $article->id);

        $this->repo->delete($article);

        return $this->success(['message' => trans('post.article_deleted')]);
    }

    /**
     * Used to download Article Attachments
     * @get ("/post/article/{uuid}/attachment/{attachment_uuid}/download")
     * @param ({
     *      @Parameter("uuid", type="string", required="true", description="Unique Id of Article"),
     *      @Parameter("attachment_uuid", type="string", required="true", description="Unique Id of Attachment"),
     * })
     * @return Response download
     */
    public function download($uuid, $attachment_uuid)
    {
        $article = $this->repo->findByUuidOrFailWithoutSession($uuid);

        if (! $article->is_public) {
            $this->authorize('list', Article::class);
        }

        $attachment = $this->upload->getAttachment($this->module, $article->id, $attachment_uuid);

        if (! \Storage::exists($attachment->filename)) {
            return view('errors.file-not-found');
        }

        $download_path = storage_path('app/'.$attachment->filename);
        return response()->download($download_path, $attachment->user_filename);
    }
}
