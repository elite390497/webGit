<?php

namespace App\Http\Requests\Configuration\Employee;

use Illuminate\Foundation\Http\FormRequest;

class LeaveTypeRequest extends FormRequest
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
        $id = $this->route('id');

        $rules = [];
        
        if ($this->method() === 'POST') {
            $rules['name'] = 'required|unique:employee_leave_types';
            $rules['alias'] = 'required|unique:employee_leave_types';
        } elseif ($this->method() === 'PATCH') {
            $rules['name'] = 'required|unique:employee_leave_types,name,'.$id.',id';
            $rules['alias'] = 'required|unique:employee_leave_types,alias,'.$id.',id';
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
            'name' => trans('employee.leave_type_name'),
            'alias' => trans('employee.leave_type_alias')
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
