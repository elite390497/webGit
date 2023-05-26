<?php

namespace App\Http\Requests\Utility;

use Illuminate\Foundation\Http\FormRequest;

class EmailTemplateRequest extends FormRequest
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
        if ($this->method() === 'POST') {
            return [
                'name'     => 'required|unique:email_templates',
                'category' => 'required|in:user'
            ];
        } elseif ($this->method() === 'PATCH') {
            return [
                'subject' => 'required',
                'body'    => 'required'
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
        if ($this->method() === 'POST') {
            return [
                'name'     => trans('utility.email_template_name'),
                'category' => trans('utility.email_template_category'),
            ];
        } elseif ($this->method() === 'PATCH') {
            return [
                'subject' => trans('utility.email_template_subject'),
                'body'    => trans('utility.email_template_body'),
            ];
        }
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
