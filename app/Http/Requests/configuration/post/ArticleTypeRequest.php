<?php

namespace App\Http\Requests\Configuration\Post;

use Illuminate\Foundation\Http\FormRequest;

class ArticleTypeRequest extends FormRequest
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
            $rules['name'] = 'required|unique:article_types';
        } elseif ($this->method() === 'PATCH') {
            $rules['name'] = 'required|unique:article_types,name,'.$id.',id';
        }

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
            'name' => trans('post.article_type_name')
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
