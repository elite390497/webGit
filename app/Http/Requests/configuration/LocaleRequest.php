<?php

namespace App\Http\Requests\Configuration;

use Illuminate\Foundation\Http\FormRequest;

class LocaleRequest extends FormRequest
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

        if ($this->path() === 'api/locale/add-word') {
            return [
                'word'        => 'required',
                'translation' => 'required',
                'module'      => 'required'
            ];
        }

        if ($this->method() === 'POST') {
            return [
                'name'   => 'required|unique:locales',
                'locale' => 'required|unique:locales'
            ];
        } elseif ($this->method() === 'PATCH') {
            return [
                'name'   => 'required|unique:locales,name,'.$id.',id',
                'locale' => 'required|unique:locales,locale,'.$id.',id',
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
        if ($this->path() === 'api/locale/add-word') {
            return [
                'word'        => trans('configuration.locale_word'),
                'translation' => trans('configuration.locale_translation'),
                'module'      => trans('configuration.locale_module'),
            ];
        }

        return [
            'name'   => trans('configuration.locale_name'),
            'locale' => trans('configuration.locale'),
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
