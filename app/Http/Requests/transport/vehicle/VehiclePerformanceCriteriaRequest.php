<?php

namespace App\Http\Requests\Transport\Vehicle;

use Illuminate\Foundation\Http\FormRequest;

class VehiclePerformanceCriteriaRequest extends FormRequest
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
            'vehicle_id'         => 'required',
            'min_mileage'        => 'required|numeric|min:0',
            'max_mileage'        => 'required|numeric|min:0|gt:min_mileage',
            'min_run'            => 'required|numeric|min:0',
            'max_run'            => 'required|numeric|min:0|gt:min_run',
            'min_service_charge' => 'required|numeric|min:0',
            'max_service_charge' => 'required|numeric|min:0|gt:min_service_charge',
            'date_effective'     => 'required|date'
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
            'vehicle_id'         => trans('transport.vehicle'),
            'min_mileage'        => trans('transport.vehicle_performance_criteria_min_mileage'),
            'max_mileage'        => trans('transport.vehicle_performance_criteria_max_mileage'),
            'min_run'            => trans('transport.vehicle_performance_criteria_min_run'),
            'max_run'            => trans('transport.vehicle_performance_criteria_max_run'),
            'min_service_charge' => trans('transport.vehicle_performance_criteria_min_service_charge'),
            'max_service_charge' => trans('transport.vehicle_performance_criteria_max_service_charge'),
            'date_effective'     => trans('transport.vehicle_performance_criteria_date_effective')
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
