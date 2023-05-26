<?php

namespace App\Http\Requests\Student;

use Illuminate\Foundation\Http\FormRequest;

class StudentQualificationRequest extends FormRequest
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
            'standard'       => trans('student.qualification_standard'),
            'institute_name' => trans('student.institute_name'),
            'start_period'   => trans('student.qualification_start_period'),
            'end_period'     => trans('student.qualification_end_period'),
            'result'         => trans('student.qualification_result')
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
