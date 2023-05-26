<?php
namespace App\Repositories\Post;

use Illuminate\Support\Str;
use App\Models\Post\Article;
use App\Repositories\Upload\UploadRepository;
use Illuminate\Validation\ValidationException;
use App\Repositories\Employee\EmployeeRepository;
use App\Repositories\Configuration\Post\ArticleTypeRepository;

class ArticleRepository
{
    protected $article;
    protected $upload;
    protected $article_type;
    protected $employee;
    protected $module = 'article';

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Article $article,
        UploadRepository $upload,
        ArticleTypeRepository $article_type,
        EmployeeRepository $employee
    ) {
        $this->article = $article;
        $this->upload = $upload;
        $this->article_type = $article_type;
        $this->employee = $employee;
    }

    /**
     * Get article query
     *
     * @return Article query
     */
    public function getQuery()
    {
        return $this->article;
    }

    /**
     * Count Article
     *
     * @return integer
     */
    public function count()
    {
        return $this->article->filterBySession()->count();
    }

    /**
     * List all article by title & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->article->filterBySession()->get()->pluck('title', 'id')->all();
    }

    /**
     * Get all articles
     *
     * @return array
     */
    public function getAll()
    {
        return $this->article->all();
    }

    /**
     * Find article with given id.
     *
     * @param integer $id
     * @return Article
     */
    public function find($id)
    {
        return $this->article->info()->filterBySession()->filterById($id)->first();
    }

    /**
     * Find article with given id or throw an error.
     *
     * @param integer $id
     * @return Article
     */
    public function findOrFail($id, $field = 'message')
    {
        $article = $this->article->info()->filterBySession()->filterById($id)->first();

        if (! $article) {
            throw ValidationException::withMessages([$field => trans('post.could_not_find_article')]);
        }

        return $article;
    }

    /**
     * Find article with given uuid.
     *
     * @param string $uuid
     * @return Article
     */
    public function findByUuid($uuid)
    {
        return $this->article->info()->filterBySession()->filterByUuid($uuid)->first();
    }

    /**
     * Find article with given uuid or throw an error.
     *
     * @param string $uuid
     * @return Article
     */
    public function findByUuidOrFail($uuid, $field = 'message')
    {
        $article = $this->article->info()->filterBySession()->filterByUuid($uuid)->first();

        if (! $article) {
            throw ValidationException::withMessages([$field => trans('post.could_not_find_article')]);
        }

        return $article;
    }

    /**
     * Find article with given uuid for any session or throw an error.
     *
     * @param string $uuid
     * @return Article
     */
    public function findByUuidOrFailWithoutSession($uuid, $field = 'message')
    {
        $article = $this->article->info()->filterByUuid($uuid)->first();

        if (! $article) {
            throw ValidationException::withMessages([$field => trans('post.could_not_find_article')]);
        }

        return $article;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return Article
     */
    public function getData($params)
    {
        $sort_by         = gv($params, 'sort_by', 'date_of_article');
        $order           = gv($params, 'order', 'desc');
        $keyword         = gv($params, 'keyword');
        $article_type_id = gv($params, 'article_type_id');

        $article_type_id = is_array($article_type_id) ? $article_type_id : ($article_type_id ? explode(',', $article_type_id) : []);

        $date_of_article_start_date = gv($params, 'date_of_article_start_date');
        $date_of_article_end_date   = gv($params, 'date_of_article_end_date');

        $query = $this->article->info()->filterBySession()->dateOfArticleBetween([
                'start_date' => $date_of_article_start_date,
                'end_date' => $date_of_article_end_date
            ])->filterByKeyword($keyword);

        if (count($article_type_id)) {
            $query->whereIn('article_type_id', $article_type_id);
        }

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all article using given params.
     *
     * @param array $params
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function paginate($params)
    {
        $page_length = gv($params, 'page_length', config('config.page_length'));

        return $this->getData($params)->paginate($page_length);
    }

    /**
     * Get all filtered data for printing
     *
     * @param array $params
     * @return Article
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get pre requisite
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        $article_types = $this->article_type->selectAll();

        return compact('article_types');
    }

    /**
     * Get course filters.
     *
     * @return Array
     */
    public function getFilters()
    {
        return $this->getPreRequisite();
    }

    /**
     * Create a new article.
     *
     * @param array $params
     * @return Article
     */
    public function create($params)
    {
        $article = $this->article->forceCreate($this->formatParams($params));

        $this->processUpload($article, $params);

        return $article;
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $article_id = null)
    {
        $title           = gv($params, 'title');
        $date_of_article = toDate(gv($params, 'date_of_article'));
        $description     = gv($params, 'description');
        $is_public       = gbv($params, 'is_public');
        $article_type_id = gv($params, 'article_type_id');

        $article_type = $this->article_type->findOrFail($article_type_id);

        if (! dateBetweenSession($date_of_article)) {
            throw ValidationException::withMessages(['date_of_article' => trans('calendar.not_in_academic_session_range', ['date' => showDate($date_of_article)])]);
        }

        $article_exists_query = ($article_id) ? $this->article->where('id', '!=', $article_id) : $this->article->whereNotNull('id');

        if ($article_exists_query->filterBySession()->filterByArticleTypeId($article_type_id)->filterByTitle($title, 1)->count()) {
            throw ValidationException::withMessages(['title' => trans('post.article_title_exists')]);
        }

        $formatted = [
            'article_type_id' => $article_type_id,
            'title'           => $title,
            'date_of_article' => toDate($date_of_article),
            'description'     => clean($description),
            'is_public'       => $is_public,
            'options'         => []
        ];

        if (! $article_id) {
            $formatted['upload_token'] = gv($params, 'upload_token');
            $formatted['uuid'] = Str::uuid();
            $formatted['user_id'] = \Auth::user()->id;
        }

        return $formatted;
    }

    /**
     * Upload attachment
     *
     * @param Article $article
     * @param array $params
     * @param string $action
     * @return void
     */
    public function processUpload(Article $article, $params = array(), $action = 'create')
    {
        $upload_token = gv($params, 'upload_token');

        if ($action === 'create') {
            $this->upload->store($this->module, $article->id, $upload_token);
        } else {
            $this->upload->update($this->module, $article->id, $upload_token);
        }
    }

    /**
     * Is given article editable.
     *
     * @param Article $article
     *
     * @return bool
     */
    public function isEditable(Article $article)
    {
        return \Auth::user()->can('edit-article') ? $this->employee->userAccessible($article->user->employee) || $article->user_id == \Auth::user()->id : null;
    }

    /**
     * Is given article editable else fail.
     *
     * @param Article $article
     *
     * @return null
     */
    public function isEditableOrFail(Article $article)
    {
        if (! $this->isEditable($article)) {
            throw ValidationException::withMessages(['message' => trans('user.permission_denied')]);
        }
    }

    /**
     * Update given article.
     *
     * @param Article $article
     * @param array $params
     *
     * @return Article
     */
    public function update(Article $article, $params)
    {
        $this->isEditableOrFail($article);

        $article->forceFill($this->formatParams($params, $article->id))->save();

        $this->processUpload($article, $params, 'update');

        return $article;
    }

    /**
     * Delete article.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(Article $article)
    {
        $this->isEditableOrFail($article);

        return $article->delete();
    }

    /**
     * Delete multiple article.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->article->whereIn('id', $ids)->delete();
    }
}
