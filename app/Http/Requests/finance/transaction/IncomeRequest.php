<?php

namespace App\Http\Requests\Finance\Transaction;

use Illuminate\Foundation\Http\FormRequest;

class IncomeRequest extends FormRequest
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
            'transaction_category_id' => 'required|integer',
            'date_of_income'          => 'required|date',
            'amount'                  => 'required|min:0|numeric',
            'description'             => 'required',
            'account_id'              => 'required|integer',
            'payment_method_id'       => 'required|integer'
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
            'transaction_category_id' => trans('finance.transaction_category'),
            'date_of_income'          => trans('finance.date_of_income'),
            'amount'                  => trans('finance.amount'),
            'description'             => trans('finance.income_description'),
            'account_id'              => trans('finance.account'),
            'payment_method_id'       => trans('finance.payment_method')
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array
     */
    public function messages()
    {
        return [];
    }
}
