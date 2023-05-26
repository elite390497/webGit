<?php
namespace App\Repositories\Configuration;

use Twilio\Exceptions\TwilioException;
use App\Models\Academic\AcademicSession;
use App\Models\Configuration\Configuration;
use Illuminate\Validation\ValidationException;

class ConfigurationRepository
{
    protected $config;
    protected $academic_session;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        Configuration $config,
        AcademicSession $academic_session
    ) {
        $this->config = $config;
        $this->academic_session = $academic_session;
    }

    /**
     * Get all config variables
     * @return Configuration
     */
    public function getAll()
    {
        return $this->config->all()->pluck('value', 'name')->all();
    }

    /**
     * Get all config variables by public value
     * @return Configuration
     */
    public function getAllPublic()
    {
        return $this->config->all()->pluck('public_value', 'name')->all();
    }

    /**
     * Get config variable by name
     * @return Configuration
     */
    public function getByName($names)
    {
        return $this->config->filterByName($names)->get()->value;
    }

    /**
     * Get selected config variables by name
     * @return Configuration
     */
    public function getSelectedByName($names)
    {
        return $this->config->whereIn('name', $names)->get()->pluck('value', 'name')->all();
    }

    public function getConfig()
    {
        if (!\Storage::exists('.app_installed')) {
           $config['failed_install'] = 1;
           return  $config;
        }

        $system_variables = getVar('system');
        $default_config = isset($system_variables['default_config']) ? $system_variables['default_config'] : [];

        $configs = $this->config->all();
        foreach ($default_config as $key => $value) {
            $config = $configs->firstWhere('name',$key) ;

            if (! $config) {
                $config = $this->firstOrCreate($key);
            }

            if (! is_numeric($config->numeric_value) && ($config->value === '' || $config->value === null)) {
                $config->numeric_value = (is_numeric($value) && floor($value) == $value) ? $value : null;
                $config->text_value = ($config->numeric_value) ? null : ($value ? : null);
                $config->save();
            }
        }

        $public_config = config('system.public_config');

        $config                  = $this->getSelectedByName($public_config);
        $config['l']             = (\Storage::exists('.access_code') ? 1 : 1);
        $config['v']             = \Storage::get('.version');
        $config['pagination']    = config('system.pagination');
        $config['mode']          = (config('app.mode') == 'test') ? 0 : 1;
        $config['default_roles'] = config('system.default_role');

        $config_variables             = getVar('config');
        $config['show_footer_credit'] = gbv($config_variables, 'show_footer_credit');
        $config['pb']                 = gbv($config_variables, 'pb');
        $config['default_currency'] = getDefaultCurrency();
        $config['current_date']       = today();
        $config['mobile_app_compatible'] = my_version_compare(\Storage::get('.version'), config('system.mobile_app_compatible'), '>=');

        if (! auth()->check()) {
            $config['authenticated'] = false;
            return $config;
        }

        $config_variables = getVar('config');
        $config = array_merge($config, $this->getAllPublic());
        $config['default_currency'] = getDefaultCurrency();
        $config['post_max_size']    = getPostMaxSize();
        $config['show_footer_credit'] = gbv($config_variables, "show_footer_credit");
        $config['pb'] = gbv($config_variables, "pb");
        $config['menu'] = explode(',', array_key_exists('menu', $config) ? $config['menu'] : '');

        $auth_user = auth()->user();
        $user_preference = $auth_user->userPreference;

        if ($user_preference) {
            $config['user_color_theme'] = $auth_user->userPreference->color_theme;
            $config['user_direction'] = $auth_user->userPreference->direction;
            $config['user_locale'] = $auth_user->userPreference->locale;
            $config['user_sidebar'] = $auth_user->userPreference->sidebar;
        }

        $config['authenticated'] = true;
        return $config;
    }

    /**
     * Find configuration by name else create.
     *
     * @param array $params
     * @return null
     */
    public function firstOrCreate($name)
    {
        return $this->config->firstOrCreate(['name' => $name]);
    }

    /**
     * Store a configuration
     *
     * @param array $params
     * @return null
     */
    public function set($name, $value, $private = 0)
    {
        $config = $this->firstOrCreate([
            'name' => $name
        ]);

        $config->numeric_value = (is_numeric($value) && floor($value) == $value) ? $value : null;
        $config->text_value = ($config->numeric_value) ? null : ($value ? : null);
        $config->is_private = $private;
        $config->save();

        return $config;
    }

    /**
     * Store configuration.
     *
     * @param array $params
     * @return null
     */
    public function store($params)
    {
        $config_type = gv($params, 'config_type');

        if ($config_type === 'menu') {
            $this->updateMenu($params);
            return;
        }

        $this->testModeOperation($params);

        $this->smsConfiguration($params);

        $old_configs = $this->getAll();

        foreach ($params as $key => $value) {
            if (! in_array($key, ['config_type','providers']) && (!in_array($key, config('system.private_config_variables')) || (in_array($key, config('system.private_config_variables')) && $value != config('system.hidden_field')))) {
                $value = (is_array($value)) ? implode(',', $value) : $value;

                $config = $this->firstOrCreate($key);
                $old_config = $config->value;

                $config->numeric_value = (is_numeric($value) && floor($value) == $value && digitCount($value) == digitCount(floor($value))) ? $value : null;
                $config->text_value = ($config->numeric_value) ? null : ($value ? : null);
                $config->save();

                if ($old_config != $config->value) {
                    $property = $config->is_private ? ['attributes' => [$key => config('system.hidden_field')]] : ['attributes' => [$key => $config->value], 'old' => [$key => $old_config]];
                    activity('config')->on($config)->withProperties($property)->log('updated');
                }
            }
        }

        $this->setLocale($params);

        $this->setVisibility();

        if ($config_type === 'mail' || $config_type === 'system' || $config_type == 'basic') {
            config(['config' => $this->getAll()]);
            $this->setEnv($config_type);
        }

        if ($config_type == 'system') {
            $this->checkSymlink();
        }
    }

    private function updateMenu($params = array())
    {
        $modules = gv($params, 'modules', []);

        $data = array();
        foreach ($modules as $module) {
            $menu = gv($module, 'menu');
            if (gbv($menu, 'visibility'))
                array_push($data, gv($menu, 'name'));

            $submenu = gv($menu, 'submenu', []);

            foreach ($submenu as $sbmenu) {
                if (gbv($sbmenu, 'visibility'))
                    array_push($data, gv($sbmenu, 'name'));
            }
        }

        $config = $this->firstOrCreate('menu');
        $config->text_value = implode(',',$data);
        $config->save();
    }

    public function getModules()
    {
        $modules = getVar('modules');

        $menu = $this->config->whereName('menu')->first();

        $menus = $menu ? explode(',',$menu->text_value) : [];

        return compact('modules','menus');
    }

    /**
     * Store test mode configuration.
     *
     * @param array $params
     * @return null
     */
    public function testModeOperation($params)
    {
        $config_type = gv($params, 'config_type');

        if (! in_array($config_type, ['system', 'mail', 'authentication', 'basic'])) {
            return;
        }

        if (isTestMode()) {
            throw ValidationException::withMessages(['message' => trans('general.restricted_test_mode_action')]);
        }
    }

    /**
     * Store SMS configuration.
     *
     * @param array $params
     * @return null
     */
    public function smsConfiguration($params)
    {
        $config_type                    = gv($params, 'config_type');
        $sms_gateway                    = gv($params, 'sms_gateway');
        $nexmo_api_key                  = gv($params, 'nexmo_api_key');
        $nexmo_api_secret               = gv($params, 'nexmo_api_secret');
        $nexmo_receiver_mobile          = gv($params, 'nexmo_receiver_mobile');
        $nexmo_sender_mobile            = gv($params, 'nexmo_sender_mobile');
        $twilio_sid                     = gv($params, 'twilio_sid');
        $twilio_token                   = gv($params, 'twilio_token');
        $twilio_receiver_mobile         = gv($params, 'twilio_receiver_mobile');
        $twilio_sender_mobile           = gv($params, 'twilio_sender_mobile');

        if ($config_type != 'sms') {
            return;
        }

        if ($sms_gateway == 'nexmo') {
            config(['nexmo.api_key' => $nexmo_api_key,'nexmo.api_secret' => $nexmo_api_secret]);
            try {
                $nexmo = app('Nexmo\Client');
                $nexmo->message()->send([
                    'to'   => $nexmo_receiver_mobile,
                    'from' => $nexmo_sender_mobile,
                    'text' => 'Test Message!'
                ]);
            } catch (\Nexmo\Client\Exception\Request $e) {
                throw ValidationException::withMessages(['nexmo_api_key' => $e->getMessage()]);
            }
        } else if ($sms_gateway == 'twilio') {
            config([
                'twilio.twilio.connections.twilio.sid' => $twilio_sid,
                'twilio.twilio.connections.twilio.token' => $twilio_token,
                'twilio.twilio.connections.twilio.from' => '+'.$twilio_sender_mobile
            ]);
            try {
                \Twilio::message('+'.$twilio_receiver_mobile, 'Test Message!');
            } catch (TwilioException $e) {
                throw ValidationException::withMessages(['twilio_sid' => $e->getMessage()]);
            }
        }
    }

    /**
     * Store locale configuration.
     *
     * @param array $params
     * @return null
     */
    public function setLocale($params)
    {
        $config_type = gv($params, 'config_type');
        $locale = gv($params, 'locale', config('app.locale'));

        if ($config_type != 'system') {
            return;
        }

        if ($locale === config('app.locale')) {
            return;
        }

        config(['app.locale' => $locale]);
        \App::setLocale(config('app.locale'));
        \Cache::forget('lang.js');
    }

    /**
     * Set configuration visibility.
     *
     * @param array $params
     * @return null
     */
    public function setVisibility()
    {
        $this->config->whereIn('name', config('system.private_config_variables'))->update(['is_private' => 1]);
        $this->config->whereNotIn('name', config('system.private_config_variables'))->update(['is_private' => 0]);
    }

    /**
     * Set default configuration variable.
     *
     * @return null
     */
    public function setDefault()
    {    
        $system_variables = getVar('system');
        $role_and_permission_variables = getVar('role_and_permission');
        config(['system' => $system_variables + $role_and_permission_variables]);
        $default_config = isset($system_variables['default_config']) ? $system_variables['default_config'] : [];
        foreach ($default_config as $key => $value) {
            config(['config.'.$key => $value]);
        }
        
        if (!\Storage::exists('.app_installed')) {
            return false;
        }

        config(['config' => $this->getAll()]);

        if (auth()->check()) {
            $auth_user = auth()->user();

            $user_preference = auth()->user()->UserPreference;

            if ($user_preference) {
                config([
                    'config.user_direction' => $user_preference->direction,
                    'config.user_locale' => $user_preference->locale,
                    'config.user_sidebar' => $user_preference->sidebar,
                    'config.user_color_theme' => $user_preference->color_theme
                ]);
            }
            
            $default_academic_session = ($user_preference) ? $this->academic_session->find($user_preference->academic_session_id) : $this->academic_session->whereIsDefault(1)->first();
            if ($default_academic_session) {
                $default_academic_session->start_date = toDate($default_academic_session->start_date);
                $default_academic_session->end_date = toDate($default_academic_session->end_date);
                config(['config.default_academic_session' => $default_academic_session]);
            } else {
                config(['config.default_academic_session' => null]);
            }
        }

        $this->setVisibility();

        config(['app.name' => config('config.institute_name')]);
        config([
            'nexmo.api_key' => config('config.nexmo_api_key'),
            'nexmo.api_secret' => config('config.nexmo_api_secret')
        ]);
        config([
            'twilio.twilio.connections.twilio.sid' => config('config.twilio_sid'),
            'twilio.twilio.connections.twilio.token' => config('config.twilio_token'),
            'twilio.twilio.connections.twilio.from' => '+'.config('config.twilio_sender_mobile')
        ]);
        config([
            'paypal.client_id' => config('config.paypal_client_id'),
            'paypal.secret' => config('config.paypal_client_secret'), 
            'paypal.settings.mode' => config('config.paypal_mode') ? 'live' : 'sandbox'
        ]);
        config([
            'jwt.ttl' => config('config.token_lifetime') ? : 120
        ]);
        
        date_default_timezone_set(config('config.timezone') ? : 'Asia/Kolkata');
        \App::setLocale(config('config.locale') ? : 'en');

    }

    /**
     * Set .env files.
     *
     * @return null
     */
    public function setEnv($type = null)
    {
        if (! $type) {
            return;
        }

        if ($type === 'system') {
            envu(['APP_DEBUG' => (!\App::environment('production') && config('config.error_display')) ? true : false]);
        }


        if ($type === 'mail') {
            envu([
                'MAIL_DRIVER'       => config('config.driver'),
                'MAIL_FROM_ADDRESS' => config('config.from_address'),
                'MAIL_FROM_NAME'    => config('config.from_name')
            ]);

            if (config('config.driver') === 'smtp') {
                envu([
                    'MAIL_HOST'       => config('config.smtp_host'),
                    'MAIL_PORT'       => config('config.smtp_port'),
                    'MAIL_USERNAME'   => config('config.smtp_username'),
                    'MAIL_PASSWORD'   => config('config.smtp_password'),
                    'MAIL_ENCRYPTION' => config('config.smtp_encryption'),
                ]);
            } elseif (config('config.driver') === 'mailgun') {
                envu([
                    'MAIL_HOST'       => config('config.mailgun_host'),
                    'MAIL_PORT'       => config('config.mailgun_port'),
                    'MAIL_USERNAME'   => config('config.mailgun_username'),
                    'MAIL_PASSWORD'   => config('config.mailgun_password'),
                    'MAIL_ENCRYPTION' => config('config.mailgun_encryption'),
                    'MAILGUN_DOMAIN'  => config('config.mailgun_domain'),
                    'MAILGUN_SECRET'  => config('config.mailgun_secret'),
                ]);
            } elseif (config('config.driver') === 'mandrill') {
                envu([
                    'MANDRILL_SECRET' => config('config.mandrill_secret'),
                ]);
            }
        }
    }

    /**
     * Get company address
     * @return string
     */
    public function getCompanyAddress()
    {
        $address = config('config.address_line_1');
        $address .= (config('config.address_line_2')) ? (', <br >'.config('config.address_line_2')) : '';
        $address .= (config('config.city')) ? ', <br >'.(config('config.city')) : '';
        $address .= (config('config.state')) ? ', '.(config('config.state')) : '';
        $address .= (config('config.zipcode')) ? ', '.(config('config.zipcode')) : '';
        $address .= (config('config.country_id')) ? '<br >'.(config('config.country')) : '';

        return $address;
    }

    /**
     * Get company logo
     * @return string
     */
    public function getCompanyLogo()
    {
        if (config('config.logo') && \File::exists(config('config.logo'))) {
            return '<img src="'.url('/'.config('config.logo')).'">';
        } else {
            return '<img src="'.url('/images/default_logo.png').'">';
        }
    }

    /**
     * Show/hide setup wizard
     * @return string
     */
    public function setupWizard($params = array())
    {
        $action = gv($params, 'action', 'hide');

        $config = $this->firstOrCreate('setup_wizard');
        $config->numeric_value = ($action == 'show') ? 1 : 0;
        $config->save();
    }

    /**
     * Check symlink
     * @return string
     */
    public function checkSymlink()
    {
        // if (\File::deleteDirectory(public_path('storage')))
        //     \File::delete(public_path('storage'));

        // \Artisan::call('storage:link');
    }
}
