<?php

namespace App\Http\Requests\Academic;

use Illuminate\Foundation\Http\FormRequest;

class CourseRequest extends FormRequest
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
            'name'             => 'required|min:1',
            'course_group_id'  => 'required',
            // 'attendance_type'  => 'required|in:daily,subject_wise',
            'registration_fee' => 'required_if:enable_registration_fee,1|integer|min:0'
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
            'name'             => trans('academic.course_name'),
            'cours_group_id'   => trans('academic.course_group'),
            'attendance_type'  => trans('student.attendance_type'),
            'registration_fee' => trans('student.registration_fee')
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
            'registration_fee.required_if' => trans('validation.required', ['attribute' => trans('student.registration_fee')])
        ];
    }
}
