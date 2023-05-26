<?php

namespace App\Http\Requests\Configuration\Finance\Transaction;

use Illuminate\Foundation\Http\FormRequest;

class TransactionCategoryRequest extends FormRequest
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
        $rules = [
            'type' => 'required|in:income,expense'
        ];

        $id = $this->route('id');

        if ($this->method() === 'POST') {
            $rules['name'] = 'required|unique:transaction_categories';
        } elseif ($this->method() === 'PATCH') {
            $rules['name'] = 'required|unique:transaction_categories,name,'.$id.',id';
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
            'name' => trans('finance.transaction_category_name'),
            'type' => trans('finance.transaction_category_type')
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
