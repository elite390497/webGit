<?php

namespace App\Http\Requests\Employee;

use Illuminate\Foundation\Http\FormRequest;

class EmployeeTermRequest extends FormRequest
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

        if ($id) {
            return [
                'date_of_leaving' => 'required_if:is_leaving,1|date',
                'leaving_remarks' => 'sometimes|min:0'
            ];
        } else {
            return [
                'date_of_joining' => 'required|date',
                'joining_remarks' => 'sometimes|min:0'
            ];
        }
    }

    /**
     * Translate fields with user friendly name.
     *
     * @return array
     */
    public function attributes()
    {
        return [
            'date_of_leaving' => trans('employee.date_of_leaving'),
            'date_of_joining' => trans('employee.date_of_joining'),
            'joining_remarks'     => trans('employee.joining_remarks'),
            'leaving_remarks'     => trans('employee.leaving_remarks')
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
            'date_of_leaving.required_if' => trans('validation.required', ['attribute' => trans('employee.date_of_leaving')]),
            'leaving_remarks.required_if' => trans('validation.required', ['attribute' => trans('employee.leaving_remarks')])
        ];
    }
}
