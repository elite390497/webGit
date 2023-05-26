<?php

namespace App\Http\Requests\Student;

use Illuminate\Foundation\Http\FormRequest;

class StudentParentRequest extends FormRequest
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

        return [
            'first_guardian_name'             => 'required',
            'first_guardian_relation'         => 'required|different:second_guardian_relation|in:'.$relations,
            'second_guardian_relation'        => 'required_with:second_guardian_name|different:first_guardian_relation|in:'.$relations,
            'first_guardian_contact_number_1' => 'required',
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
            'first_guardian_name'             => trans('student.first_guardian_name'),
            'second_guardian_name'             => trans('student.second_guardian_name'),
            'first_guardian_contact_number_1' => trans('student.first_guardian_contact_number'),
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
            'first_guardian_relation.different' => trans('general.different_custom', ['attribute' => trans('general.relation')]),
            'second_guardian_relation.different' => trans('general.different_custom', ['attribute' => trans('general.relation')]),
            'second_guardian_relation.required_with' => trans('validation.required', ['attribute' => trans('general.relation')])
        ];
    }
}
