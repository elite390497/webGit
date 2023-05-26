<?php

namespace App\Http\Requests\Frontend;

use Illuminate\Foundation\Http\FormRequest;

class MenuRequest extends FormRequest
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
            $rules['name'] = 'required|unique:frontend_menus|max:30';
        } elseif ($this->method() === 'PATCH') {
            $rules['name'] = 'required|max:30|unique:frontend_menus,name,'.$id.',id';
        }

        $rules['page_id'] = 'required_if:has_sub_menu,0';

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
            'name' => trans('frontend.menu_name'),
            'page_id' => trans('frontend.page')
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
            'page_id.required_if' => trans('validation.required', ['attribute' => trans('frontend.page')])
        ];
    }
}
