<?php

namespace App\Http\Requests\Reception;

use Illuminate\Foundation\Http\FormRequest;

class PostalRecordRequest extends FormRequest
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
            'sender_title'     => 'required',
            'receiver_title'   => 'required',
            'sender_address'   => 'required',
            'receiver_address' => 'required',
            'reference_number' => 'required',
            'type'             => 'required|in:dispatch,receive',
            'date'             => 'required|date'
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
            'sender_title'     => trans('reception.postal_record_sender_title'),
            'receiver_title'   => trans('reception.postal_record_receiver_title'),
            'sender_address'   => trans('reception.postal_record_sender_address'),
            'receiver_address' => trans('reception.postal_record_receiver_address'),
            'reference_number' => trans('reception.postal_record_reference_number'),
            'type'             => trans('reception.postal_record_type'),
            'date'             => trans('reception.postal_record_date')
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