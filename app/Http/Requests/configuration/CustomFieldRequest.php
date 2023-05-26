<?php

namespace App\Http\Requests\Configuration;

use Illuminate\Foundation\Http\FormRequest;

class CustomFieldRequest extends FormRequest
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
            'form'       => 'required',
            'name'       => 'required',
            'type'       => 'required',
            'width'      => 'required',
            'min_length' => 'integer',
            'max_length' => 'integer|gte:min_length',
            'min_vavlue' => 'integer',
            'max_vavlue' => 'integer|gte:min_value',
            'decimal_place' => 'integer|min:0|max:5'
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
            'form'          => trans('configuration.custom_field_form'),
            'name'          => trans('configuration.custom_field_name'),
            'type'          => trans('configuration.custom_field_type'),
            'width'         => trans('configuration.custom_field_width'),
            'min_length'    => trans('configuration.custom_field_min_length'),
            'max_length'    => trans('configuration.custom_field_max_length'),
            'min_value'     => trans('configuration.custom_field_min_value'),
            'max_value'     => trans('configuration.custom_field_max_value'),
            'decimal_place' => trans('configuration.custom_field_decimal_place')
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