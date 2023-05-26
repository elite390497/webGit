<?php

namespace App\Http\Requests\Frontend;

use Illuminate\Foundation\Http\FormRequest;

class BlockRequest extends FormRequest
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
        $uuid = $this->route('uuid');

        $rules = [];
        
        if ($this->method() === 'POST') {
            $rules['title'] = 'required|unique:frontend_blocks|max:150';
        } elseif ($this->method() === 'PATCH') {
            $rules['title'] = 'required|max:150|unique:frontend_blocks,title,'.$uuid.',uuid';
        }

        $rules['body'] = 'required';

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
            'body'  => trans('frontend.block_body'),
            'title' => trans('frontend.block_title')
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
