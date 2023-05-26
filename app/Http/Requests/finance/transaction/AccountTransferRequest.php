<?php

namespace App\Http\Requests\Finance\Transaction;

use Illuminate\Foundation\Http\FormRequest;

class AccountTransferRequest extends FormRequest
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
            'date_of_account_transfer' => 'required|date',
            'amount'                   => 'required|min:0|numeric',
            'description'              => 'required',
            'from_account_id'          => 'required|integer',
            'to_account_id'            => 'required|integer|different:from_account_id',
            'payment_method_id'        => 'required|integer'
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
            'date_of_expense'         => trans('finance.date_of_expense'),
            'amount'                  => trans('finance.amount'),
            'description'             => trans('finance.expense_description'),
            'from_account_id'         => trans('finance.from_account'),
            'to_account_id'           => trans('finance.to_account'),
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
