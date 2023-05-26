<?php

namespace App\Http\Requests\Employee;

use Illuminate\Foundation\Http\FormRequest;

class EmployeeQualificationRequest extends FormRequest
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
        return [
            'standard'       => 'required',
            'institute_name' => 'required',
            'start_period'   => 'required',
            'end_period'     => 'required',
            'result'         => 'required'
        ];
    }

    /**
     * Translate fields with user friendly name.
     *
     * @return array
     */
    public function attributes()
    {
        return [
            'standard'       => trans('employee.qualification_standard'),
            'institute_name' => trans('employee.institute_name'),
            'start_period'   => trans('employee.qualification_start_period'),
            'end_period'     => trans('employee.qualification_end_period'),
            'result'         => trans('employee.qualification_result')
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
        ];
    }
}
