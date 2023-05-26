<?php

namespace App\Http\Requests\Student;

use Illuminate\Foundation\Http\FormRequest;

class TransferCertificateRequest extends FormRequest
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
            'date_of_application' => 'required|date',
            'date_of_issue' => 'required|date',
            'transfer_certificate_format' => 'required',
            'number' => 'required'
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
            'date_of_application' => trans('student.date_of_application'),
            'date_of_issue' => trans('student.date_of_issue'),
            'transfer_certificate_format' => trans('academic.transfer_certificate_format'),
            'number' => trans('student.transfer_certificate_number'),
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
