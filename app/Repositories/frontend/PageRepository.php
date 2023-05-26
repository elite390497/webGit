<?php
namespace App\Repositories\Frontend;

use Illuminate\Support\Str;
use App\Models\Frontend\Page;
use App\Repositories\Upload\UploadRepository;
use Illuminate\Validation\ValidationException;

class PageRepository
{
    protected $page;
    protected $upload;
    protected $module = 'frontend-page';

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Page $page,
        UploadRepository $upload
    ) {
        $this->page = $page;
        $this->upload = $upload;
    }

    /**
     * Get page query
     *
     * @return Page query
     */
    public function getQuery()
    {
        return $this->page;
    }

    /**
     * Count Page
     *
     * @return integer
     */
    public function count()
    {
        return $this->page->count();
    }

    /**
     * List all page by title & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->page->get()->pluck('title', 'id')->all();
    }

    /**
     * Get all pages
     *
     * @return array
     */
    public function getAll()
    {
        return $this->page->all();
    }

    /**
     * Find page with given id.
     *
     * @param integer $id
     * @return Page
     */
    public function find($id)
    {
        return $this->page->filterById($id)->first();
    }

    /**
     * Find page with given id or throw an error.
     *
     * @param integer $id
     * @return Page
     */
    public function findOrFail($id, $field = 'message')
    {
        $page = $this->page->filterById($id)->first();

        if (! $page) {
            throw ValidationException::withMessages([$field => trans('frontend.could_not_find_page')]);
        }

        return $page;
    }

    /**
     * Find page with given uuid.
     *
     * @param string $uuid
     * @return Page
     */
    public function findByUuid($uuid)
    {
        return $this->page->filterByUuid($uuid)->first();
    }

    /**
     * Find page with given uuid or throw an error.
     *
     * @param string $uuid
     * @return Page
     */
    public function findByUuidOrFail($uuid, $field = 'message')
    {
        $page = $this->page->filterByUuid($uuid)->first();

        if (! $page) {
            throw ValidationException::withMessages([$field => trans('frontend.could_not_find_page')]);
        }

        return $page;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return Page
     */
    public function getData($params)
    {
        $sort_by = gv($params, 'sort_by', 'title');
        $order   = gv($params, 'order', 'asc');
        $title   = gv($params, 'title');

        return $this->page->filterByTitle($title)->orderBy($sort_by, $order);
    }

    /**
     * Paginate all page using given params.
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
     * @return Page
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Create a new page.
     *
     * @param array $params
     * @return Page
     */
    public function create($params)
    {
        $page = $this->page->forceCreate($this->formatParams($params));

        $this->processUpload($page, $params);

        return $page;
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $page_id = null)
    {
        $title    = gv($params, 'title');
        $body     = gv($params, 'body');
        $is_draft = gbv($params, 'is_draft');

        $this->validateSlider($params);

        $formatted = [
            'title'    => $title,
            'body'     => clean($body),
            'is_draft' => $is_draft
        ];

        $options['show_blocks']          = gbv($params, 'show_blocks');
        $options['show_upcoming_events'] = gbv($params, 'show_upcoming_events');
        $options['show_latest_articles'] = gbv($params, 'show_latest_articles');
        $options['has_slider']           = gbv($params, 'has_slider');

        if (! $page_id) {
            $formatted['upload_token'] = gv($params, 'upload_token');
            $formatted['uuid']         = Str::uuid();
        }

        if (gbv($params, 'has_slider')) {
            $options['sliders'] = gv($params, 'sliders');
        }

        $formatted['options'] = $options;

        return $formatted;
    }

    private function validateSlider($params)
    {
        if (! gbv($params, 'has_slider'))
            return;

        $sliders = gv($params, 'sliders', []);

        if (! $sliders) {
            throw ValidationException::withMessages(['message' => trans('frontend.could_not_find_page_slider_image')]);
        }

        foreach ($sliders as $slider) {
            $title       = gv($slider, 'title');
            $description = gv($slider, 'description');
            $image       = gv($slider, 'image');

            if (! $image) {
                throw ValidationException::withMessages(['message' => trans('validation.required', ['attribute' => trans('frontend.slider_image')])]);
            }

            $image = str_replace('storage/', '', $image);

            if (! \Storage::disk('public')->exists($image)) {
                throw ValidationException::withMessages(['message' => trans('frontend.could_not_find_page_slider_image')]);
            }

            if (! $description) {
                throw ValidationException::withMessages(['message' => trans('validation.required', ['attribute' => trans('frontend.slider_image_description')])]);
            }

            if (! $title) {
                throw ValidationException::withMessages(['message' => trans('validation.required', ['attribute' => trans('frontend.slider_image_title')])]);
            }
        }
    }

    private function updateSliderIfRequired(Page $page, $params) 
    {
        if (! gbv($params, 'has_slider'))
            return;

        $sliders = gv($params, 'sliders', []);

        $page_sliders = $page->getOption('sliders');

        foreach ($sliders as $index => $slider) {
            $image = gv($slider, 'image');
            $page_slider = (is_array($page_sliders) && array_key_exists($index, $page_sliders)) ? $page_sliders[$index] : [];
            $page_slider_image = gv($page_slider, 'image');

            if ($page_slider_image && $page_slider_image != $image) {
                $image = str_replace('storage/', '', $page_slider_image);
                if (\Storage::disk('public')->exists($image)) {
                    \Storage::disk('public')->delete($image);
                }
            }
        }
    }

    /**
     * Upload attachment
     *
     * @param Page $page
     * @param array $params
     * @param string $action
     * @return void
     */
    public function processUpload(Page $page, $params = array(), $action = 'create')
    {
        $upload_token = gv($params, 'upload_token');

        if ($action === 'create') {
            $this->upload->store($this->module, $page->id, $upload_token);
        } else {
            $this->upload->update($this->module, $page->id, $upload_token);
        }
    }

    /**
     * Is given page accessible.
     *
     * @param Page $page
     *
     * @return bool
     */
    public function isAccessible(Page $page)
    {
        if (! \Auth::check() && $page->is_draft) {
            throw ValidationException::withMessages(['message' => trans('general.invalid_link')]);
        }
    }

    /**
     * Update given page.
     *
     * @param Page $page
     * @param array $params
     *
     * @return Page
     */
    public function update(Page $page, $params)
    {
        $this->updateSliderIfRequired($page, $params);

        $page->forceFill($this->formatParams($params, $page->id))->save();

        $this->processUpload($page, $params, 'update');

        return $page;
    }

    /**
     * Delete page.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(Page $page)
    {
        if ($page->menu && $page->menu->getOption('is_default')) {
            throw ValidationException::withMessages(['message' => trans('frontend.could_not_modify_default_menu')]);
        }

        return $page->delete();
    }

    /**
     * Delete multiple page.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->page->whereIn('id', $ids)->delete();
    }
}
