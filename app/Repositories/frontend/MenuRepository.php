<?php
namespace App\Repositories\Frontend;

use Illuminate\Support\Str;
use App\Models\Frontend\Menu;
use App\Models\Frontend\Page;
use Illuminate\Validation\ValidationException;

class MenuRepository
{
    protected $menu;
    protected $page;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Menu $menu,
        Page $page
    ) {
        $this->menu = $menu;
        $this->page = $page;
    }

    /**
     * Get menu query
     *
     * @return Menu query
     */
    public function getQuery()
    {
        return $this->menu;
    }

    /**
     * Count Menu
     *
     * @return integer
     */
    public function count()
    {
        return $this->menu->count();
    }

    /**
     * List all menu by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->menu->get()->pluck('name', 'id')->all();
    }

    /**
     * Get all menus
     *
     * @return array
     */
    public function getAll()
    {
        return $this->menu->all();
    }

    /**
     * Find menu with given id.
     *
     * @param integer $id
     * @return Menu
     */
    public function find($id)
    {
        return $this->menu->info()->mainMenu()->filterById($id)->first();
    }

    /**
     * Find menu with given id or throw an error.
     *
     * @param integer $id
     * @return Menu
     */
    public function findOrFail($id, $field = 'message')
    {
        $menu = $this->menu->info()->mainMenu()->filterById($id)->first();

        if (! $menu) {
            throw ValidationException::withMessages([$field => trans('frontend.could_not_find_menu')]);
        }

        return $menu;
    }

    /**
     * Check default menu existence
     */
    private function checkDefaultMenus()
    {
        $system_vars = getVar('system');
        $default_menus = gv($system_vars, 'default_frontend_menus', []);
        foreach ($default_menus as $default_menu) {
            $menu = $this->menu->firstOrCreate(['name' => toWord($default_menu)]);
            $menu->slug = createSlug($default_menu);
            $menu->type = $menu->type ? : 'header';
            $options = $menu->options;
            $options['is_default'] = 1;
            $menu->options = $options;
            $menu->save();

            if (! $menu->Page) {
                $page =$this->page->forceCreate([
                    'title'        => toWord($default_menu),
                    'uuid'         => Str::uuid(),
                    'upload_token' => Str::uuid(),
                    'options'      => []
                ]);

                $menu->frontend_page_id = $page->id;
                $menu->save();
            }
        }
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return Menu
     */
    public function getData($params)
    {
        $this->checkDefaultMenus();

        $sort_by = gv($params, 'sort_by', 'name');
        $order   = gv($params, 'order', 'asc');
        $name    = gv($params, 'name');

        return $this->menu->info()->mainMenu()->filterByName($name)->orderBy('position','asc')->orderBy($sort_by, $order);
    }

    /**
     * Get all menu using given params.
     *
     * @param array $params
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function get($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Get all filtered data for printing
     *
     * @param array $params
     * @return Menu
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Reorder all main menu
     *
     * @param array $params
     */
    public function reorder($params)
    {
        $header_list = gv($params, 'header_list', []);
        foreach ($header_list as $index => $item) {
            $menu = $this->menu->filterByName($item, 1)->first();
            $menu->position = $index;
            $menu->save();
        }

        $footer_list = gv($params, 'footer_list', []);
        foreach ($footer_list as $index => $item) {
            $menu = $this->menu->filterByName($item, 1)->first();
            $menu->position = $index;
            $menu->save();
        }
    }

    /**
     * Reorder all sub menu
     *
     * @param array $params
     * @param Menu $menu
     */
    public function reorderSubMenu(Menu $menu, $params)
    {
        if (! $menu->children()->count()) {
            throw ValidationException::withMessages(['message' => trans('general.invalid_action')]);
        }

        $list = gv($params, 'list', []);
        foreach ($list as $index => $item) {
            $sub_menu = $this->menu->filterByParentId($menu->id)->filterByName($item, 1)->first();
            $sub_menu->position = $index;
            $sub_menu->save();
        }
    }

    /**
     * Get pre requisite
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        $pages = generateNormalSelectOption($this->page->orderBy('title','asc')->get()->pluck('title','id')->all());

        return compact('pages');
    }

    /**
     * Create a new menu.
     *
     * @param array $params
     * @return Menu
     */
    public function create($params)
    {
        $menu = $this->menu->forceCreate($this->formatParams($params));

        $has_sub_menu = gbv($params, 'has_sub_menu');

        if ($has_sub_menu && $menu->type == 'header') {
            $this->updateSubMenu($menu, $params);
        }

        return $menu;
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $menu_id = null)
    {
        $name         = gv($params, 'name');
        $type         = gv($params, 'type');
        $has_sub_menu = gbv($params, 'has_sub_menu');

        if ($has_sub_menu && $type == 'header') {
            $this->validateSubMenu($params);
        }

        return [
            'name'             => $name,
            'slug'             => createSlug($name),
            'type'             => $type,
            'frontend_page_id' => gv($params, 'page_id'),
            'options'          => []
        ];
    }

    /**
     * Validate sub menu.
     *
     * @param array $params
     */
    private function validateSubMenu($params)
    {
        $sub_menus = gv($params, 'sub_menus', []);

        if (! count($sub_menus)) {
            throw ValidationException::withMessages(['message' => trans('frontend.could_not_find_sub_menu')]);
        }

        $sub_menu_names = array();
        foreach ($sub_menus as $index => $sub_menu) {
            $sub_menu_names[] = gv($sub_menu, 'name');

            if (! gv($sub_menu, 'name')) {
                throw ValidationException::withMessages(['sub_menu_'.$index => trans('validation.required', ['attribute' => trans('frontend.sub_menu')])]);
            }

            if (! gv($sub_menu, 'page_id')) {
                throw ValidationException::withMessages(['sub_menu_page_id_'.$index => trans('validation.required', ['attribute' => trans('frontend.page')])]);
            }
        }

        if (count($sub_menus) != count(array_unique($sub_menu_names))) {
            throw ValidationException::withMessages(['message' => trans('frontend.duplicate_sub_menu_found')]);
        }
    }

    /**
     * Update sub menu.
     *
     * @param Menu $menu
     * @param array $params
     */
    private function updateSubMenu(Menu $menu, $params = array())
    {
        $sub_menus = gv($params, 'sub_menus', []);
        $sub_menu_names = array();

        foreach ($sub_menus as $index => $sub_menu) {
            $sub_menu_names[] = gv($sub_menu, 'name');

            $sub_menu = $this->menu->firstOrCreate([
                'name'             => gv($sub_menu, 'name'),
                'frontend_page_id' => gv($sub_menu, 'page_id'),
                'parent_id'        => $menu->id
            ]);

            $sub_menu->slug = createSlug(gv($sub_menu, 'name'));
            $sub_menu->save();
        }

        $this->menu->whereParentId($menu->id)->whereNotIn('name', $sub_menu_names)->delete();
    }

    /**
     * Update given menu.
     *
     * @param Menu $menu
     * @param array $params
     *
     * @return Menu
     */
    public function update(Menu $menu, $params)
    {
        if ($menu->getOption('is_default')) {
            throw ValidationException::withMessages(['message' => trans('frontend.could_not_modify_default_menu')]);
        }

        $menu->forceFill($this->formatParams($params, $menu->id))->save();

        $has_sub_menu = gbv($params, 'has_sub_menu');

        if ($has_sub_menu && $menu->type == 'header') {
            $this->updateSubMenu($menu, $params);
        }

        return $menu;
    }

    /**
     * Delete menu.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(Menu $menu)
    {
        if ($menu->getOption('is_default')) {
            throw ValidationException::withMessages(['message' => trans('frontend.could_not_modify_default_menu')]);
        }
        
        return $menu->delete();
    }

    /**
     * Delete multiple menu.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->menu->whereIn('id', $ids)->delete();
    }
}
