<?php
namespace App\Repositories\Auth;

use App\Jobs\SendSMS;
use App\Notifications\TwoFactorSecurity;

class TwoFactorSecurityRepository
{

    /**
     * Set two factor security code.
     *
     * @param User
     * @return two factor code
     */

    public function set($user)
    {
        if (! config('config.two_factor_security')) {
            return;
        }

        $two_factor_code = rand(100000, 999999);

        \Cache::put('tfc_'.$user->id, $two_factor_code, 10 * 60);

        if (config('config.two_factor_security_method') == 'email') {
            $user->notify(new TwoFactorSecurity($two_factor_code));
        } else if (config('config.two_factor_security_method') == 'sms') {
            if ($user->hasRole(config('system.default_role.student'))) {
                $number = optional($user->student)->contact_number;
            } else if ($user->hasRole(config('system.default_role.parent'))) {
                $number = optional($user->parent)->first_guardian_contact_number_1;
            } else {
                $number = optional($user->employee)->contact_number;
            }

            $sms = 'Your login OTP is '.$two_factor_code.' valid for 10 minutes. Do not share this code with any one. '. config('app.name');
            if ($number) {
                SendSMS::dispatch([$number], $sms);
            }
        }

        return $two_factor_code;
    }
}
