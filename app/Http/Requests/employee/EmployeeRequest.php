<?php

namespace App\Http\Requests\Employee;

use Illuminate\Foundation\Http\FormRequest;

class EmployeeRequest extends FormRequest
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
            'first_name'      => 'required|min:2',
            'date_of_birth'   => 'required|date',
            'date_of_joining' => 'required|date|after:date_of_birth',
            'contact_number'  => 'required',
            'gender'          => 'required',
            'father_name'     => 'required|min:1',
            'mother_name'     => 'required|min:1',
            'designation_id'  => 'required',
            'code'            => 'required|numeric|min:0'
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
            'date_of_birth'   => trans('employee.date_of_birth'),
            'date_of_joining' => trans('employee.date_of_joining'),
            'contact_number'  => trans('employee.contact_number'),
            'gender'          => trans('employee.gender'),
            'father_name'     => trans('employee.father_name'),
            'mother_name'     => trans('employee.mother_name'),
            'designation_id'  => trans('employee.designation'),
            'code'            => trans('employee.code')
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
