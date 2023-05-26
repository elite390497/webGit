<?php
namespace App\Repositories\Institute;

use App\Repositories\TagRepository;
use App\Models\Institute\InstituteDocument;
use App\Repositories\Upload\UploadRepository;
use Illuminate\Validation\ValidationException;

class InstituteDocumentRepository
{
    protected $institute_document;
    protected $upload;
    protected $tag;
    protected $module = 'institute_document';

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        InstituteDocument $institute_document,
        UploadRepository $upload,
        TagRepository $tag
    ) {
        $this->institute_document = $institute_document;
        $this->upload = $upload;
        $this->tag = $tag;
    }

    /**
     * Get institute document query
     *
     * @return InstituteDocument query
     */
    public function getQuery()
    {
        return $this->institute_document;
    }

    /**
     * Count institute document
     *
     * @return integer
     */
    public function count()
    {
        return $this->institute_document->count();
    }

    /**
     * Get all institute documents
     *
     * @return array
     */
    public function getAll()
    {
        return $this->institute_document->all();
    }

    /**
     * Find institute document with given id.
     *
     * @param integer $id
     * @return InstituteDocument
     */
    public function find($id)
    {
        return $this->institute_document->info()->find($id);
    }

    /**
     * Find institute document with given id or throw an error.
     *
     * @param integer $id
     * @return InstituteDocument
     */
    public function findOrFail($id, $field = 'message')
    {
        $institute_document = $this->institute_document->info()->find($id);

        if (! $institute_document) {
            throw ValidationException::withMessages([$field => trans('transport.could_not_find_document')]);
        }

        return $institute_document;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return InstituteDocument
     */
    public function getData($params)
    {
        $sort_by     = gv($params, 'sort_by', 'date_of_expiry');
        $order       = gv($params, 'order', 'desc');
        $expired     = gbv($params, 'expired');
        $expiring_in = gv($params, 'expiring_in');
        $keyword     = gv($params, 'keyword');
        $tag_id      = gv($params, 'tag_id');
        $tag_id      = is_array($tag_id) ? $tag_id : ($tag_id ? explode(',', $tag_id) : []);

        $expiring_date = date('Y-m-d', strtotime('+'.$expiring_in.' day', strtotime(date('Y-m-d'))));

        $query = $this->institute_document->info()->filterByKeyword($keyword);

        if (count($tag_id)) {
            $query->whereHas('tags', function($q) use($tag_id) {
                $q->whereIn('slug', $tag_id);
            });
        }

        if ($expired) {
            $query->where('date_of_expiry', '<', date('Y-m-d'));
        } elseif (! $expired && $expiring_in) {
            $query->where('date_of_expiry', '<', $expiring_date);
        }

        return $query->orderBy($sort_by, $order);
    }

    /**
     * Paginate all institute documents using given params.
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
     * @return InstituteDocument
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get institute document pre requisite.
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        $tags = $this->tag->getAll(['type' => 'institute_document']);
        
        return compact('tags');
    }

    /**
     * Get institute document filters.
     *
     * @return Array
     */
    public function getFilters()
    {
        $tags = $this->tag->getAll(['type' => 'institute_document']);
        
        return compact('tags');
    }

    /**
     * Create a new institute document.
     *
     * @param array $params
     * @return InstituteDocument
     */
    public function create($params)
    {
        $this->upload->validateUpload($params, $this->module);

        $institute_document = $this->institute_document->forceCreate($this->formatParams($params));

        $institute_document = $this->updateTags($institute_document, $params);

        $this->processUpload($institute_document, $params);

        return $institute_document;
    }

    /**
     * Update tags
     * @param  InstituteDocument $institute_document
     * @param  array             $params             
     * @return InstituteDocument
     */
    private function updateTags(InstituteDocument $institute_document, $params = array())
    {
        $tags = array();
        foreach (gkv(gv($params, 'tags', []), 'name') as $tag) {
            $tags[] = $tag;
        }
        $tags = $this->tag->create('institute_document', $tags);

        $selected_tags = gv($params, 'tags',[]);
        $tag_ids = $tags->whereIn('slug', gkv($selected_tags, 'slug'))->pluck('id')->all();
        $institute_document->tags()->sync($tag_ids);

        return $institute_document;
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param integer $institute_document_id
     * @return array
     */
    private function formatParams($params, $institute_document_id = null)
    {
        $title          = gv($params, 'title');
        $date_of_expiry = gv($params, 'date_of_expiry');
        $description    = gv($params, 'description');

        if ($date_of_expiry && ! validateDate($date_of_expiry)) {
            throw ValidationException::withMessages(['date_of_expiry' => trans('validation.required', ['attribute' => trans('institute.document_date_of_expiry')])]);
        }

        $query = ($institute_document_id) ? $this->institute_document->where('id', '!=', $institute_document_id) : $this->institute_document;

        if ($query->filterByTitle($title, 1)->count()) {
            throw ValidationException::withMessages(['title' => trans('institute.document_title_exists')]);
        }

        $formatted = [
            'title'          => $title,
            'date_of_expiry' => $date_of_expiry,
            'description'    => $description
        ];

        $options[] = [];

        if (! $institute_document_id) {
            $formatted['upload_token'] = gv($params, 'upload_token');
        }

        $formatted['options'] = $options;
        return $formatted;
    }

    /**
     * Upload attachment
     *
     * @param InstituteDocument $institute_document
     * @param array $params
     * @param string $action
     * @return void
     */
    public function processUpload(InstituteDocument $institute_document, $params = array(), $action = 'create')
    {
        $upload_token = gv($params, 'upload_token');

        if ($action === 'create') {
            $this->upload->store($this->module, $institute_document->id, $upload_token);
        } else {
            $this->upload->update($this->module, $institute_document->id, $upload_token);
        }
    }

    /**
     * Update given institute document.
     *
     * @param InstituteDocument $institute_document
     * @param array $params
     *
     * @return InstituteDocument
     */
    public function update(InstituteDocument $institute_document, $params)
    {
        $this->upload->validateUpload($params, $this->module, $institute_document->id);

        $institute_document->forceFill($this->formatParams($params, $institute_document->id))->save();

        $institute_document = $this->updateTags($institute_document, $params);

        $this->processUpload($institute_document, $params, 'update');

        return $institute_document;
    }

    /**
     * Find whether institute document is deletable or not.
     *
     * @param integer $id
     * @return InstituteDocument $institute_document
     */
    public function deletable($id)
    {
        $institute_document = $this->findOrFail($id);

        return $institute_document;
    }

    /**
     * Delete institute document.
     *
     * @param InstituteDocument $institute_document
     * @return bool|null
     */
    public function delete(InstituteDocument $institute_document)
    {
        $this->tag->delete('institute_document', [$institute_document->id]);

        return $institute_document->delete();
    }

    /**
     * Delete multiple institute documentss.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->institute_document->whereIn('id', $ids)->delete();
    }
}