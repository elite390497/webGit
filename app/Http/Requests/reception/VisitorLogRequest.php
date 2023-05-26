<?php

namespace App\Http\Requests\Reception;

use Illuminate\Foundation\Http\FormRequest;

class VisitorLogRequest extends FormRequest
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
            'visiting_purpose_id'   => 'required',
            'name'                  => 'required',
            'relation_with_student' => 'required_if:type,parent',
            'type'                  => 'required|in:parent,other',
            'contact_number'        => 'required_if:type,other',
            'address'               => 'required_if:type,other',
            'visitor_count'         => 'required|numeric|min:1',
            'student_id'            => 'required_if:type,parent',
            'date_of_visit'         => 'required'
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
            'visiting_purpose_id'   => trans('reception.visiting_purpose'),
            'type'                  => trans('reception.visitor_type'),
            'name'                  => trans('reception.visitor_name'),
            'relation_with_student' => trans('reception.relation_with_student'),
            'contact_number'        => trans('reception.visitor_contact_number'),
            'address'               => trans('reception.visitor_address'),
            'visitor_count'         => trans('reception.visitor_count'),
            'student_id'            => trans('student.student'),
            'date_of_visit'         => trans('reception.date_of_visit'),
            'entry_time'            => trans('reception.entry_time')
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
            'name.required_if'           => trans('validation.required', ['attribute' => trans('reception.visitor_name')]),
            'contact_number.required_if' => trans('validation.required', ['attribute' => trans('reception.visitor_contact_number')]),
            'address.required_if'        => trans('validation.required', ['attribute' => trans('reception.visitor_address')]),
            'student_id.required_if'     => trans('validation.required', ['attribute' => trans('student.student')]),
            'relation_with_student.required_if' => trans('validation.required', ['attribute' => trans('reception.relation_with_student')])
        ];
    }
}
