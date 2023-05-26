<?php
namespace App\Repositories\Auth;

use App\User;
use App\Jobs\SendMail;
use App\UserPreference;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class UserRepository
{
    protected $user;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        User $user
    ) {
        $this->user  = $user;
    }

    /**
     * Find user by Id
     *
     * @param integer $id
     * @return User
     */

    public function findOrFail($id = null)
    {
        $user = $this->user->with('roles', 'userPreference','userPreference.academicSession')->find($id);

        if (! $user) {
            throw ValidationException::withMessages(['message' => trans('user.could_not_find')]);
        }

        return $user;
    }

    /**
     * Find user by Email
     *
     * @param email $email
     * @return User
     */

    public function findByEmail($email = null)
    {
        return $this->user->with('roles', 'userPreference')->filterByEmail($email, 1)->first();
    }

    /**
     * Find user by Username
     *
     * @param username $username
     * @return User
     */

    public function findByUsername($username = null)
    {
        return $this->user->with('roles', 'userPreference')->filterByUsername($username, 1)->first();
    }

    /**
     * Update given user preference.
     *
     * @param UserPreference $user_preference
     * @param array $params
     *
     * @return User
     */
    public function updatePreference(UserPreference $user_preference, $params = array())
    {
        $user_preference->color_theme = gv($params, 'color_theme', config('config.color_theme'));
        $user_preference->direction   = gv($params, 'direction', config('config.direction'));
        $user_preference->locale      = gv($params, 'locale', config('config.locale'));
        $user_preference->sidebar     = gv($params, 'sidebar', config('config.sidebar'));
        $user_preference->save();

        if ($user_preference->direction === 'rtl') {
            \Cache::put('direction', 'rtl', 1440 * 60);
        } else {
            \Cache::put('direction', 'ltr', 1440 * 60);
        }
        \Cache::put('locale', $user_preference->locale, 1440 * 60);
    }
}
