<?php

namespace App\Http\Requests\Student;

use Illuminate\Foundation\Http\FormRequest;

class FeePaymentRequest extends FormRequest
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
            'amount'                  => 'required|numeric',
            'installment_id'          => 'required|integer',
            'date'                    => 'required|date',
            'additional_fee_charge'   => 'numeric|min:0',
            'additional_fee_discount' => 'numeric|min:0'
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
            'amount'                  => trans('finance.amount'),
            'installment_id'          => trans('finance.fee_installment'),
            'date'                    => trans('finance.date_of_payment'),
            'additional_fee_charge'   => trans('student.additional_fee_charge'),
            'additional_fee_discount' => trans('student.additional_fee_discount')
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
