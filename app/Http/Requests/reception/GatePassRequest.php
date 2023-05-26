<?php

namespace App\Http\Requests\Reception;

use Illuminate\Foundation\Http\FormRequest;

class GatePassRequest extends FormRequest
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
            'employee_id' => 'required_if:type,employee',
            'student_id'  => 'required_if:type,student',
            'reason'      => 'required',
            'type'        => 'required|in:student,employee',
            'date'        => 'required|date'
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
            'employee_id' => trans('employee.employee'),
            'student_id'  => trans('student.student'),
            'reason'      => trans('reception.gate_pass_reason'),
            'type'        => trans('reception.gate_pass_type'),
            'date'        => trans('reception.gate_pass_date')
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
            'employee_id.required_if' => trans('validation.required', ['attribute' => trans('employee.employee')]),
            'student_id.required_if' => trans('validation.required', ['attribute' => trans('student.student')]),
        ];
    }
}