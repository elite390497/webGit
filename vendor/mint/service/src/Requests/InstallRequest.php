<?php

namespace Mint\Service\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InstallRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $option = $this->route('option');

        $rules = array();

        $rules = [
            'db_port'     => 'required',
            'db_host'     => 'required',
            'db_database' => 'required',
            'db_username' => 'required'
        ];

        if ($option === 'admin') {
            $rules['first_name']            = 'required';
            $rules['last_name']             = 'required';
            $rules['email']                 = 'required|email';
            $rules['username']              = 'required';
            $rules['password']              = 'required|min:6';
            $rules['password_confirmation'] = 'required|same:password';
        }

        if ($option === 'access_code') {
            $rules['access_code']  = 'required';
            $rules['envato_email'] = 'required|email';
        }

        return $rules;
    }

    /**
     * Translate fields with user friendly name.
     *
     * @return array
     */
    public function attributes()
    {
        return [
            'db_port'               => trans('install.db_port'),
            'db_host'               => trans('install.db_host'),
            'db_database'           => trans('install.db_database'),
            'db_username'           => trans('install.db_username'),
            'first_name'            => trans('user.first_name'),
            'last_name'             => trans('user.last_name'),
            'email'                 => trans('user.email'),
            'username'              => trans('auth.username'),
            'password'              => trans('user.password'),
            'password_confirmation' => trans('user.password_confirmation'),
            'access_code'           => trans('install.access_code'),
            'envato_email'          => trans('install.envato_email')
        ];
    }
}
