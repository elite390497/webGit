<?php

namespace App\Http\Requests\Reception;

use Illuminate\Foundation\Http\FormRequest;

class VisitorMessageRequest extends FormRequest
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
            'name' => 'required|max:150',
            'email' => 'required|email',
            'contact_number' => 'required',
            'subject' => 'required|min:10',
            'message' => 'required|min:20'
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
            'name'  => trans('frontend.contact_name'),
            'email'  => trans('frontend.contact_email'),
            'contact_number'  => trans('frontend.contact_number'),
            'subject'  => trans('frontend.contact_subject'),
            'message'  => trans('frontend.contact_message')
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
