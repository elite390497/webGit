<?php

namespace App\Http\Requests\Configuration\Employee;

use Illuminate\Foundation\Http\FormRequest;

class AttendanceTypeRequest extends FormRequest
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

        $rules['type'] = 'required';
        
        if ($this->method() === 'POST') {
            $rules['name'] = 'required|unique:employee_attendance_types';
            $rules['alias'] = 'required|unique:employee_attendance_types';
        } elseif ($this->method() === 'PATCH') {
            $rules['name'] = 'required|unique:employee_attendance_types,name,'.$id.',id';
            $rules['alias'] = 'required|unique:employee_attendance_types,alias,'.$id.',id';
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
            'type' => trans('employee.attendance_type'),
            'name' => trans('employee.attendance_type_name'),
            'alias' => trans('employee.attendance_type_alias')
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
