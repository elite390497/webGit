<?php

namespace App\Http\Requests\Reception;

use Illuminate\Foundation\Http\FormRequest;

class EnquiryRequest extends FormRequest
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
            'first_guardian_name'      => 'required',
            'first_guardian_relation'  => 'required|different:second_guardian_relation,third_guardian_relation|in:'.$relations,
            'second_guardian_relation' => 'required_with:second_guardian_name|different:first_guardian_relation,third_guardian_relation|in:'.$relations,
            'third_guardian_relation'  => 'required_with:third_guardian_name|different:first_guardian_relation,second_guardian_relation|in:'.$relations,
            'contact_number'           => 'required',
            'email'                    => 'email',
            'date_of_enquiry'          => 'required|date',
            'enquiry_type_id'          => 'required',
            'enquiry_source_id'        => 'required'
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
            'first_guardian_name'  => trans('student.first_guardian_name'),
            'second_guardian_name' => trans('student.second_guardian_name'),
            'third_guardian_name'  => trans('student.third_guardian_name'),
            'first_guardian_relation'  => trans('general.relation'),
            'second_guardian_relation' => trans('general.relation'),
            'third_guardian_relation'  => trans('general.relation'),
            'contact_number'       => trans('student.contact_number'),
            'email'                => trans('student.email'),
            'date_of_enquiry'      => trans('reception.date_of_enquiry'),
            'enquiry_type_id'      => trans('reception.enquiry_type'),
            'enquiry_source_id'    => trans('reception.enquiry_source')
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
            'third_guardian_relation.different' => trans('general.different_custom', ['attribute' => trans('general.relation')]),
            'second_guardian_relation.required_with' => trans('validation.required', ['attribute' => trans('general.relation')]),
            'third_guardian_relation.required_with' => trans('validation.required', ['attribute' => trans('general.relation')])
        ];
    }
}
