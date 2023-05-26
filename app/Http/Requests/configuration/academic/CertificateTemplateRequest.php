<?php

namespace App\Http\Requests\Configuration\Academic;

use Illuminate\Foundation\Http\FormRequest;

class CertificateTemplateRequest extends FormRequest
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
        $id = $this->route('id');

        $rules = [];
        
        if ($this->method() === 'POST') {
            $rules['name'] = 'required|unique:certificate_templates';
        } elseif ($this->method() === 'PATCH') {
            $rules['name'] = 'required|unique:certificate_templates,name,'.$id.',id';
        }

        $rule['type'] = 'required|in:student,employee';
        $rule['body'] = 'required';

        return $rules;
    }

    /**
     * Translate fields with user friendly name.
     *
     * @return array
     */
    public function attributes()
    {
        return [
            'name' => trans('academic.certificate_template_name'),
            'type' => trans('academic.certificate_template_type')
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
