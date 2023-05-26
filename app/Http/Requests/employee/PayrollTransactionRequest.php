<?php

namespace App\Http\Requests\Employee;

use Illuminate\Foundation\Http\FormRequest;

class PayrollTransactionRequest extends FormRequest
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
            'employee_id'         => 'required',
            'head'                => 'required',
            'account_id'          => 'required',
            'payment_method_id'   => 'required',
            'amount'              => 'required|min:0|numeric',
            'date_of_transaction' => 'date'
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
            'employee_id'         => trans('employee.employee'),
            'head'                => trans('employee.payroll_transaction_head'),
            'account_id'          => trans('finance.account'),
            'payment_method_id'   => trans('finance.payment_method'),
            'amount'              => trans('finance.amount'),
            'date_of_transaction' => trans('finance.date_of_transaction')
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
