<?php

namespace App\Http\Requests\Student;

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
            'student_email'    => 'email',
            'student_username' => 'alpha|max:20',
            'parent_email'     => 'email',
            'parent_username'  => 'alpha|max:20'
        ];

        if (request('enable_student_login') && request('change_student_password')) {
            $rules['student_password'] = 'required|min:6';
            $rules['student_password_confirmation'] = 'required|min:6|same:student_password';
        }

        if (request('enable_parent_login') && request('change_parent_password')) {
            $rules['parent_password'] = 'required|min:6';
            $rules['parent_password_confirmation'] = 'required|min:6|same:parent_password';
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
            'student_email'                 => trans('student.student_email'),
            'student_username'              => trans('student.student_username'),
            'parent_email'                  => trans('student.parent_email'),
            'parent_username'               => trans('student.parent_username'),
            'student_password'              => trans('auth.password'),
            'student_password_confirmation' => trans('auth.confirm_password'),
            'parent_password'               => trans('auth.password'),
            'parent_password_confirmation'  => trans('auth.confirm_password')
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array
     */
    public function messages()
    {
        return [];
    }
}
