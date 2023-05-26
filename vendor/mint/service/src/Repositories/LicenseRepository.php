<?php
namespace Mint\Service\Repositories;

use Illuminate\Validation\ValidationException;

class LicenseRepository
{
    public function verify($params)
    {
        $access_code = isset($params['access_code']) ? $params['access_code'] : null;
        $envato_email = isset($params['envato_email']) ? $params['envato_email'] : null;

        $url = config('app.verifier').'/api/cc?a=install&u='.url()->current().'&ac='.$access_code.'&i='.config('app.item').'&e='.$envato_email;
        $response = curlIt($url);

        $status = (isset($response['status']) && $response['status']) ? 1 : 0;

        if (! $status) {
            $message = isset($response['message']) ? $response['message'] : trans('install.contact_script_author');
            throw ValidationException::withMessages(['message' => $message]);
        }

        $checksum = isset($response['checksum']) ? $response['checksum'] : null;

        \Storage::put('.app_installed', $checksum);
        \Storage::put('.access_code', $access_code);
        \Storage::put('.account_email', $envato_email);
    }
}
