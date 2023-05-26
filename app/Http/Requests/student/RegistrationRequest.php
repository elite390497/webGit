<?php

namespace App\Http\Requests\Student;

use Illuminate\Foundation\Http\FormRequest;

class RegistrationRequest extends FormRequest
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
        $relations = implode(',', gv(getVar('list'), 'relations', []));

        if (request('student_type') == 'new') {
            return [
                'first_name'                      => 'required|min:2',
                'date_of_birth'                   => 'required|date',
                'date_of_registration'            => 'required|date|after:date_of_birth',
                'contact_number'                  => 'required',
                'gender'                          => 'required',
                'first_guardian_name'             => 'required_if:parent_type,new|min:3',
                'first_guardian_relation'         => 'required_if:parent_type,new|different:second_guardian_relation|in:'.$relations,
                'second_guardian_relation' => 'required_with:second_guardian_name|different:first_guardian_relation|in:'.$relations,
                'first_guardian_contact_number_1' => 'required_if:parent_type,new',
                'course_id'                       => 'required'
            ];
        } else {
            return [
                'student_id'              => 'required',
                'date_of_registration'    => 'required|date|after:date_of_birth',
                'course_id'               => 'required'
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
            'student_id'               => trans('student.student'),
            'first_name'               => trans('student.first_name'),
            'last_name'                => trans('student.last_name'),
            'date_of_birth'            => trans('student.date_of_birth'),
            'date_of_registration'     => trans('student.date_of_registration'),
            'contact_number'           => trans('student.contact_number'),
            'gender'                   => trans('student.gender'),
            'first_guardian_name'      => trans('student.first_guardian_name'),
            'first_guardian_relation'  => trans('general.relation'),
            'second_guardian_name'     => trans('student.second_guardian_name'),
            'second_guardian_relation' => trans('general.relation'),
            'course_id'                => trans('academic.course')
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
            'first_guardian_name.required_if'             => trans('validation.required', ['attribute' => trans('student.first_guardian_name')]),
            'first_guardian_contact_number_1.required_if' => trans('validation.required', ['attribute' => trans('student.first_guardian_contact_number_1')]),
            'first_guardian_relation.different' => trans('general.different_custom', ['attribute' => trans('general.relation')]),
            'second_guardian_relation.different' => trans('general.different_custom', ['attribute' => trans('general.relation')]),
            'second_guardian_relation.required_with' => trans('validation.required', ['attribute' => trans('general.relation')])
        ];
    }
}
