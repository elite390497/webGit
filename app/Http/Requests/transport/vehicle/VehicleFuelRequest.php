<?php

namespace App\Http\Requests\Transport\Vehicle;

use Illuminate\Foundation\Http\FormRequest;

class VehicleFuelRequest extends FormRequest
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
            'vehicle_id'      => 'required',
            'quantity'        => 'required|numeric|min:0',
            'price_per_unit'  => 'required|numeric|min:0',
            'date_of_fueling' => 'required|date',
            'log'             => 'required|numeric|min:1'
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
            'vehicle_id'      => trans('transport.vehicle'),
            'quantity'        => trans('transport.vehicle_fuel_quantity'),
            'price_per_unit'  => trans('transport.vehicle_fuel_price_per_unit'),
            'date_of_fueling' => trans('transport.date_of_fueling'),
            'log'             => trans('transport.log')
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
