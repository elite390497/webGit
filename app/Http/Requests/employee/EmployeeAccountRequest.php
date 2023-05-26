<?php

namespace App\Http\Requests\Employee;

use Illuminate\Foundation\Http\FormRequest;

class EmployeeAccountRequest extends FormRequest
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
            'name'                     => 'required',
            'account_number'           => 'required',
            'bank_name'                => 'required',
            'branch_name'              => 'required',
            'bank_identification_code' => 'required'
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
            'name'                     => trans('employee.account_name'),
            'account_number'           => trans('employee.account_number'),
            'bank_name'                => trans('employee.bank_name'),
            'branch_name'              => trans('employee.branch_name'),
            'bank_identification_code' => trans('employee.bank_identification_code')
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
