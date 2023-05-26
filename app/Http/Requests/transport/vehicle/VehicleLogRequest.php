<?php

namespace App\Http\Requests\Transport\Vehicle;

use Illuminate\Foundation\Http\FormRequest;

class VehicleLogRequest extends FormRequest
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
            'vehicle_id'  => 'required',
            'log'         => 'required|integer',
            'date_of_log' => 'required|date'
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
            'vehicle_id'  => trans('transport.vehicle'),
            'log'         => trans('transport.vehicle_log_log'),
            'date_of_log' => trans('transport.vehicle_log_date_of_log')
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
