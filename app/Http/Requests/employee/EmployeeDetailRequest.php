<?php

namespace App\Http\Requests\Employee;

use Illuminate\Foundation\Http\FormRequest;

class EmployeeDetailRequest extends FormRequest
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
            'first_name'      => 'required_if:type,basic|min:2',
            'last_name'       => 'required_if:type,basic|min:2',
            'date_of_birth'   => 'required_if:type,basic|date',
            'contact_number'  => 'required_if:type,contact',
            'gender'          => 'required_if:type,basic',
            'father_name'     => 'required_if:type,basic|min:5',
            'mother_name'     => 'required_if:type,basic|min:5'
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
            'first_name'      => trans('employee.first_name'),
            'last_name'       => trans('employee.last_name'),
            'date_of_birth'   => trans('employee.date_of_birth'),
            'contact_number'  => trans('employee.contact_number'),
            'gender'          => trans('employee.gender'),
            'father_name'     => trans('employee.father_name'),
            'mother_name'     => trans('employee.mother_name')
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
            'first_name.required_if'     => trans('validation.required', ['attribute' => trans('employee.first_name')]),
            'last_name.required_if'      => trans('validation.required', ['attribute' => trans('employee.last_name')]),
            'date_of_birth.required_if'  => trans('validation.required', ['attribute' => trans('employee.date_of_birth')]),
            'contact_number.required_if' => trans('validation.required', ['attribute' => trans('employee.contact_number')]),
            'gender.required_if'         => trans('validation.required', ['attribute' => trans('employee.gender')]),
            'father_name.required_if'    => trans('validation.required', ['attribute' => trans('employee.father_name')]),
            'mother_name.required_if'    => trans('validation.required', ['attribute' => trans('employee.mother_name')])
        ];
    }
}
