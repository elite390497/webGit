<?php

namespace App\Http\Requests\Reception;

use Illuminate\Foundation\Http\FormRequest;

class CallLogRequest extends FormRequest
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
            'calling_purpose_id' => 'required',
            'name'               => 'required',
            'type'               => 'required|in:incoming,outgoing',
            'incoming_number'    => 'required',
            'outgoing_number'    => 'required',
            'date'       => 'required|date'
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
            'calling_purpose_id' => trans('reception.calling_purpose'),
            'type'               => trans('reception.call_type'),
            'name'               => trans('reception.call_log_name'),
            'incoming_number'    => trans('reception.call_log_incoming_number'),
            'outgoing_number'    => trans('reception.call_log_outgoing_number'),
            'date'       => trans('reception.date')
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