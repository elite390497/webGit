<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use App\Repositories\Auth\UserRepository;
use App\Repositories\Configuration\LocaleRepository;
use App\Http\Controllers\Controller;

class UserController extends Controller
{
    protected $request;
    protected $locale;
    protected $repo;
    protected $module = 'user';

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
        Request $request,
        LocaleRepository $locale,
        UserRepository $repo
    ) {
        $this->request = $request;
        $this->locale = $locale;
        $this->repo = $repo;
    }

    /**
     * Used to get preference Pre Requisite
     * @get ("/api/user/preference/pre-requisite")
     * @return Response
     */
    public function preferencePreRequisite()
    {
        $system_variables = getVar('system');
        $color_themes = isset($system_variables['color_themes']) ? $system_variables['color_themes'] : [];
        $directions = isset($system_variables['directions']) ? $system_variables['directions'] : [];
        $sidebar = isset($system_variables['sidebar']) ? $system_variables['sidebar'] : [];
        $locales = generateNormalSelectOption($this->locale->list());

        return $this->success(compact('color_themes', 'directions', 'sidebar', 'locales'));
    }

    /**
     * Used to store user preference
     * @post ("/api/user/preference")
     * @return Response
     */
    public function preference()
    {
        $this->repo->updatePreference(\Auth::user()->UserPreference, $this->request->all());

        return $this->success(['message' => trans('user.preference_updated')]);
    }
}
