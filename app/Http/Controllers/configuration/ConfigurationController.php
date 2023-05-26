<?php

namespace App\Http\Controllers\Configuration;

use Illuminate\Http\Request;
use App\Repositories\Configuration\LocaleRepository;
use App\Http\Requests\Configuration\ConfigurationRequest;
use App\Repositories\Configuration\ConfigurationRepository;
use App\Http\Controllers\Controller;

class ConfigurationController extends Controller
{
    protected $request;
    protected $repo;
    protected $locale;

    protected $module = 'configuration';

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request, ConfigurationRepository $repo, LocaleRepository $locale)
    {
        $this->request = $request;
        $this->repo = $repo;
        $this->locale = $locale;

        $this->middleware('permission:access-configuration')->except(['getConfigurationVariable','getConfig','clearCache']);
        $this->middleware('prohibited.test.mode')->only(['uploadImage','removeImage']);
    }

    /**
     * Used to clear cache
     */
    public function clearCache()
    {
        \Artisan::call('clean');

        return 'Cache cleared!';
    }

    /**
     * Used to get configuration
     * @get ("/api/config")
     * @return Response
     */
    public function getConfig()
    {
        return $this->ok($this->repo->getConfig());
    }

    /**
     * Used to get configuration
     * @get ("/api/configuration")
     * @return Response
     */
    public function index()
    {
        return $this->ok($this->repo->getAllPublic());
    }

    /**
     * Used to save configuration
     * @post ("/api/configuration")
     * @param Various Configuration Variable
     * @return Response
     */
    public function store(ConfigurationRequest $request)
    {
        $this->repo->store($this->request->all());

        $config = $this->repo->getConfig();

        return $this->success(['message' => trans('configuration.stored')]);
    }

    /**
     * Show/hide setup wizard
     * @post ("/api/setup/wizard")
     * @return Response
     */
    public function setupWizard()
    {
        $this->repo->setupWizard($this->request->all());

        return $this->success(['message' => trans('configuration.stored')]);
    }

    /**
     * Used to get configuration variables
     * @post ("/api/configuration/variable")
     * @param ({
     *      @Parameter("type", type="string", required="true", description="Type of Configuration Variable, can be system or mail"),
     * })
     * @return Response
     */
    public function getConfigurationVariable()
    {
        $type = request('type') ? : 'system';

        $system_variables = getVar('system');
        $list = getVar('list');

        if ($type === 'mail') {
            $mail_drivers = gv($system_variables, 'mail_drivers', []);
            return $this->success(compact('mail_drivers'));
        }

        if ($type === 'library') {
            $late_fee_frequencies = generateNormalTranslatedSelectOption(isset($list['frequency']) ? $list['frequency'] : []);
            return $this->success(compact('late_fee_frequencies'));
        }

        if ($type === 'menu') {
            $data = $this->repo->getModules();
            $modules = gv($data, 'modules', []);
            $menus = gv($data, 'menus', []);
            return $this->success(compact('modules','menus'));
        }

        $color_themes = gv($system_variables, 'color_themes', []);

        $directions = gv($system_variables, 'directions', []);

        $sidebar = gv($system_variables, 'sidebar', []);

        $date_formats = gv($system_variables, 'date_formats', []);

        $time_formats = gv($system_variables, 'time_formats', []);

        $notification_positions = gv($system_variables, 'notification_positions', []);

        $timezones = generateNormalSelectOptionValueOnly(getVar('timezone'));

        $locales = generateNormalSelectOption($this->locale->list());

        $currencies = array();

        foreach (getVar('currency') as $currency) {
            $symbol_prefix = ($currency['position'] == 'prefix') ? $currency['symbol'] : '';
            $symbol_suffix = ($currency['position'] == 'suffix') ? $currency['symbol'] : '';
            $currencies[$currency['name']] = $currency['description'].' ('.$symbol_prefix.round(15.12345, $currency['decimal_place']).$symbol_suffix.')';
        }

        $currencies = generateNormalSelectOption($currencies);
        $days = generateNormalTranslatedSelectOption(isset($list['day']) ? $list['day'] : []);

        return $this->success(compact('color_themes', 'directions', 'date_formats', 'time_formats', 'notification_positions', 'timezones', 'locales', 'sidebar', 'currencies','days'));
    }

    /**
     * Used to fetch list data like gender, days
     * @post ("/api/fetch/lists")
     * @param ({
     *      @Parameter("lists", type="string", required="true", description="Type of lists to be fetched comma separated"),
     * })
     * @return Response
     */
    public function fetchList()
    {
        $lists = request('lists');
        $data = array();

        if (!$lists) {
            return $this->success(compact('data'));
        }

        $lists = explode(',', $lists);

        if (in_array('country', $lists)) {
            $data['country'] = generateNormalSelectOption(getVar('country'));
        }

        if (in_array('timezone', $lists)) {
            $data['timezone'] = generateNormalSelectOptionValueOnly(getVar('timezone'));
        }

        $list_data = getVar('list');
        foreach ($lists as $list) {
            $list_item = isset($list_data[$list]) ? $list_data[$list] : [];
            if ($list != 'country' && $list != 'timezone') {
                $data[$list] = count($list_item) ? generateTranslatedSelectOption($list_item) : [];
            }
        }
        
        return $this->success(compact('data'));
    }

    /**
     * Used to upload image
     * @post ("/api/configuration/{type}")
     * @param ({
     *      @Parameter("image", type="image", required="true", description="Image to be uploaded"),
     * })
     * @return Response
     */
    public function uploadImage($type)
    {
        if (! in_array($type, ['icon','logo'])) {
            return  $this->error(['message' => trans('general.invalid_action')]);
        }

        $image = str_replace('storage/', '', config('config.'.$type));

        if ($image && \Storage::disk('public')->exists($image)) {
            \Storage::disk('public')->delete($image);
        }

        $file = \Storage::disk('public')->putFile($type, request()->file('image'));
        $img = \Image::make(\Storage::disk('public')->get($file));
        $img->resize(null, 150, function ($constraint) {
            $constraint->aspectRatio();
        })->stream();
        \Storage::disk('public')->put($file, $img);

        $config = $this->repo->firstOrCreate($type);
        $old_config = $config->value;
        $config->text_value = 'storage/'.$file;
        $config->save();

        activity($type)->on($config)->withProperties(['attributes' => [$type => $config->value], 'old' => [$type => $old_config]])->log('uploaded');

        return $this->success(['message' => trans('configuration.'.$type.'_uploaded'),'image' => $config->text_value]);
    }

    /**
     * Used to remove main or sidebar image
     * @post ("/api/configuration/{type}/remove")
     * @return Response
     */
    public function removeImage($type)
    {
        if (! in_array($type, ['icon','logo'])) {
            return  $this->error(['message' => trans('general.invalid_action')]);
        }

        $image = str_replace('storage/', '', config('config.'.$type));

        if (!$image) {
            return $this->error(['message' => trans('configuration.no_'.$type.'_uploaded')]);
        }

        if (\Storage::disk('public')->exists($image)) {
            \Storage::disk('public')->delete($image);
        }

        $old_config = $this->repo->firstOrCreate($type);

        $this->repo->set($type, '');

        activity($type)->on($old_config)->withProperties(['attributes' => [$type => null], 'old' => [$type => $old_config->value]])->log('removed');

        return $this->success(['message' => trans('configuration.'.$type.'_removed')]);
    }
}
