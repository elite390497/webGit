<?php

namespace App\Http\Requests\Library;

use Illuminate\Foundation\Http\FormRequest;

class BookLogReturnRequest extends FormRequest
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
            'return_remarks'         => 'required_if:is_non_returnable,0',
            'date_of_return'         => 'required_if:is_non_returnable,0|date',
            'non_returnable_remarks' => 'required_if:is_non_returnable,1|min:20',
            'non_returnable_charge'  => 'required_if:non_returnable_charge_applicable,1|integer'
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
            'return_remarks'         => trans('library.return_remarks'),
            'date_of_return'         => trans('library.date_of_return'),
            'non_returnable_remarks' => trans('library.non_returnable_remarks'),
            'non_returnable_charge'  => trans('library.non_returnable_charge')
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
            'return_remarks.required_if'         => trans('validation.required', ['attribute' => trans('library.return_remarks')]),
            'date_of_return.required_if'         => trans('validation.required', ['attribute' => trans('library.date_of_return')]),
            'non_returnable_remarks.required_if' => trans('validation.required', ['attribute' => trans('library.non_returnable_remarks')]),
            'non_returnable_charge.required_if'  => trans('validation.required', ['attribute' => trans('library.non_returnable_charge')])
        ];
    }
}
