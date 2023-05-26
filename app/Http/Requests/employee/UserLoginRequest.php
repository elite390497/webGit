<?php

namespace App\Http\Requests\Employee;

use Illuminate\Foundation\Http\FormRequest;

class UserLoginRequest extends FormRequest
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
        $rules = [
            'employee_email'    => 'email',
            'employee_username' => 'max:20',
            'role'              => 'required_if:enable_employee_login,1'
        ];

        if (request('enable_employee_login') && request('change_employee_password')) {
            $rules['employee_password'] = 'required|min:6';
            $rules['employee_password_confirmation'] = 'required|min:6|same:employee_password';
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
            'role'                           => trans('configuration.role'),
            'employee_email'                 => trans('employee.employee_email'),
            'employee_username'              => trans('employee.employee_username'),
            'employee_password'              => trans('auth.password'),
            'employee_password_confirmation' => trans('auth.confirm_password')
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'role.required_if' => trans('validation.required', ['attribute' => trans('configuration.role')])
        ];
    }
}
