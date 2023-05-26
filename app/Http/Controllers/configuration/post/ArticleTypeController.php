<?php

namespace App\Http\Controllers\Configuration\Post;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Post\ArticleTypeRequest;
use App\Repositories\Configuration\Post\ArticleTypeRepository;

class ArticleTypeController extends Controller
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
        ArticleTypeRepository $repo
    ) {
        $this->request = $request;
        $this->repo = $repo;

        $this->middleware('permission:access-configuration');
    }

    /**
     * Used to get all Article Types
     * @get ("/api/post/article/type")
     * @return Response
     */
    public function index()
    {
        return $this->ok($this->repo->paginate($this->request->all()));
    }

    /**
     * Used to print all Article Types
     * @post ("/api/post/article/type/print")
     * @return Response
     */
    public function print()
    {
        $article_types = $this->repo->print(request('filter'));

        return view('print.configuration.post.article-type', compact('article_types'))->render();
    }

    /**
     * Used to generate pdf all Article Types
     * @post ("/api/post/article/type/pdf")
     * @return Response
     */
    public function pdf()
    {
        $article_types = $this->repo->print(request('filter'));

        $uuid = Str::uuid();
        $pdf = \PDF::loadView('print.configuration.post.article-type', compact('article_types'))->save('../storage/app/downloads/'.$uuid.'.pdf');

        return $uuid;
    }

    /**
     * Used to store Article Type
     * @post ("/api/post/article/type")
     * @param ({
     *      @Parameter("name", type="string", required="true", description="Name of Article Type"),
     *      @Parameter("description", type="text", required="optional", description="Description of Article Type")
     * })
     * @return Response
     */
    public function store(ArticleTypeRequest $request)
    {
        $article_type = $this->repo->create($this->request->all());

        return $this->success(['message' => trans('post.article_type_added')]);
    }

    /**
     * Used to get Article Type detail
     * @get ("/api/post/article/type/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Article Type"),
     * })
     * @return Response
     */
    public function show($id)
    {
        return $this->ok($this->repo->findOrFail($id));
    }

    /**
     * Used to update Article Type
     * @patch ("/api/post/article/type/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Article Type"),
     *      @Parameter("name", type="string", required="true", description="Name of Article Type"),
     *      @Parameter("description", type="text", required="optional", description="Description of Article Type")
     * })
     * @return Response
     */
    public function update($id, ArticleTypeRequest $request)
    {
        $article_type = $this->repo->findOrFail($id);

        $article_type = $this->repo->update($article_type, $this->request->all());

        return $this->success(['message' => trans('post.article_type_updated')]);
    }

    /**
     * Used to delete Article Type
     * @delete ("/api/post/article/type/{id}")
     * @param ({
     *      @Parameter("id", type="integer", required="true", description="Id of Article Type"),
     * })
     * @return Response
     */
    public function destroy($id)
    {
        $article_type = $this->repo->deletable($id);

        $this->repo->delete($article_type);

        return $this->success(['message' => trans('post.article_type_deleted')]);
    }
}
