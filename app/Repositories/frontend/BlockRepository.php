<?php
namespace App\Repositories\Frontend;

use Illuminate\Support\Str;
use App\Models\Frontend\Menu;
use App\Models\Frontend\Block;
use App\Repositories\Upload\UploadRepository;
use Illuminate\Validation\ValidationException;

class BlockRepository
{
    protected $block;
    protected $upload;
    protected $menu;
    protected $module = 'frontend-block';

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Block $block,
        UploadRepository $upload,
        Menu $menu
    ) {
        $this->block = $block;
        $this->upload = $upload;
        $this->menu = $menu;
    }

    /**
     * Get block query
     *
     * @return Block query
     */
    public function getQuery()
    {
        return $this->block;
    }

    /**
     * Count Block
     *
     * @return integer
     */
    public function count()
    {
        return $this->block->count();
    }

    /**
     * List all block by title & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->block->get()->pluck('title', 'id')->all();
    }

    /**
     * Get all blocks
     *
     * @return array
     */
    public function getAll()
    {
        return $this->block->all();
    }

    /**
     * Find block with given id.
     *
     * @param integer $id
     * @return Block
     */
    public function find($id)
    {
        return $this->block->info()->filterById($id)->first();
    }

    /**
     * Find block with given id or throw an error.
     *
     * @param integer $id
     * @return Block
     */
    public function findOrFail($id, $field = 'message')
    {
        $block = $this->block->info()->filterById($id)->first();

        if (! $block) {
            throw ValidationException::withMessages([$field => trans('frontend.could_not_find_block')]);
        }

        return $block;
    }

    /**
     * Find block with given uuid.
     *
     * @param string $uuid
     * @return Block
     */
    public function findByUuid($uuid)
    {
        return $this->block->info()->filterByUuid($uuid)->first();
    }

    /**
     * Find block with given uuid or throw an error.
     *
     * @param string $uuid
     * @return Block
     */
    public function findByUuidOrFail($uuid, $field = 'message')
    {
        $block = $this->block->info()->filterByUuid($uuid)->first();

        if (! $block) {
            throw ValidationException::withMessages([$field => trans('frontend.could_not_find_block')]);
        }

        return $block;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return Block
     */
    public function getData($params)
    {
        $sort_by = gv($params, 'sort_by', 'title');
        $order   = gv($params, 'order', 'asc');
        $title   = gv($params, 'title');

        return $this->block->info()->filterByTitle($title)->orderBy('position','asc')->orderBy($sort_by, $order);
    }

    /**
     * Paginate all block using given params.
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
     * @return Block
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Reorder all main block
     *
     * @param array $params
     */
    public function reorder($params)
    {
        $list = gv($params, 'list', []);
        foreach ($list as $index => $item) {
            $block = $this->block->filterByTitle($item, 1)->first();
            $block->position = $index;
            $block->save();
        }
    }

    /**
     * Get pre requisite
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        $menus = generateNormalSelectOption($this->menu->orderBy('name','asc')->get()->pluck('name','id')->all());

        return compact('menus');
    }

    /**
     * Create a new block.
     *
     * @param array $params
     * @return Block
     */
    public function create($params)
    {
        $block = $this->block->forceCreate($this->formatParams($params));

        $this->processUpload($block, $params);

        return $block;
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $block_id = null)
    {
        $title          = gv($params, 'title');
        $body           = gv($params, 'body');
        $is_draft       = gbv($params, 'is_draft');
        $featured_image = gv($params, 'featured_image');

        if ($featured_image) {

            $image = str_replace('storage/', '', $featured_image);

            if (! \Storage::disk('public')->exists($image)) {
                throw ValidationException::withMessages(['message' => trans('frontend.could_not_find_block_featured_image')]);
            }
        }

        $formatted = [
            'title'            => $title,
            'body'             => $body,
            'frontend_menu_id' => gv($params, 'menu_id'),
            'url'              => gv($params, 'menu_id') ? null : gv($params, 'url'),
            'is_draft'         => $is_draft,
            'featured_image'   => $featured_image,
            'options'          => []
        ];

        if (! $block_id) {
            $formatted['upload_token'] = gv($params, 'upload_token');
            $formatted['uuid'] = Str::uuid();
        }

        return $formatted;
    }

    /**
     * Upload attachment
     *
     * @param Block $block
     * @param array $params
     * @param string $action
     * @return void
     */
    public function processUpload(Block $block, $params = array(), $action = 'create')
    {
        $upload_token = gv($params, 'upload_token');

        if ($action === 'create') {
            $this->upload->store($this->module, $block->id, $upload_token);
        } else {
            $this->upload->update($this->module, $block->id, $upload_token);
        }
    }

    /**
     * Is given block accessible.
     *
     * @param Block $block
     *
     * @return bool
     */
    public function isAccessible(Block $block)
    {
        if (! \Auth::check() && $block->is_draft) {
            throw ValidationException::withMessages(['message' => trans('general.invalid_link')]);
        }
    }

    /**
     * Update given block.
     *
     * @param Block $block
     * @param array $params
     *
     * @return Block
     */
    public function update(Block $block, $params)
    {
        if ($block->featured_image && $block->featured_image != gv($params, 'featured_image')) {
            $image = str_replace('storage/', '', $block->featured_image);
            if (\Storage::disk('public')->exists($image)) {
                \Storage::disk('public')->delete($image);
            }
        }

        $block->forceFill($this->formatParams($params, $block->id))->save();

        $this->processUpload($block, $params, 'update');

        return $block;
    }

    /**
     * Delete block.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(Block $block)
    {
        return $block->delete();
    }

    /**
     * Delete multiple block.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->block->whereIn('id', $ids)->delete();
    }
}
