<?php

namespace App\Http\Requests\Resource;

use Illuminate\Foundation\Http\FormRequest;

class AssignmentRequest extends FormRequest
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
            'title'              => 'required',
            'description'        => 'required',
            'date_of_assignment' => 'required|date',
            'due_date'           => 'required|date|after_or_equal:date_of_assignment',
            'subject_id'         => 'required'
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
            'title'           => trans('resource.assignment_title'),
            'description'     => trans('resource.assignment_description'),
            'date_of_article' => trans('resource.date_of_assignment'),
            'due_date'        => trans('resource.due_date_of_assignment'),
            'subject_id'      => trans('academic.subject')
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
