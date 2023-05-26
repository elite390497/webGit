<?php

namespace App\Http\Requests\Reception;

use Illuminate\Foundation\Http\FormRequest;

class ComplaintRequest extends FormRequest
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
            'complaint_type_id'          => 'required',
            'employee_id'                => 'required',
            'complainant_name'           => 'required',
            'complainant_contact_number' => 'required',
            'description'                => 'required',
            'date_of_complaint'          => 'required|date',
            'date_of_resolution'         => 'nullable|date|after_or_equal:date_of_complaint',
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
            'complaint_type_id'          => trans('reception.complaint_type'),
            'employee_id'                => trans('employee.employee'),
            'complainant_name'           => trans('reception.complainant_name'),
            'complainant_contact_number' => trans('reception.complainant_contact_number'),
            'description'                => trans('reception.complaint_description'),
            'date_of_complaint'          => trans('reception.date_of_complaint'),
            'date_of_resolution'         => trans('reception.date_of_resolution')
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array
     */
    public function messages()
    {
        return [];
    }
}