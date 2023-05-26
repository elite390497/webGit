<?php

namespace App\Http\Requests\Transport\Vehicle;

use Illuminate\Foundation\Http\FormRequest;

class VehicleServiceRecordRequest extends FormRequest
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
            'date_of_service' => 'required|date',
            'amount'          => 'required|numeric|min:0',
            'log'             => 'required|integer',
            'next_due_date'   => 'sometimes|date',
            'next_due_log'    => 'sometimes|integer',
            'employee_id'     => 'sometimes'
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
            'amount'          => trans('transport.vehicle_service_record_amount'),
            'date_of_service' => trans('transport.date_of_service'),
            'log'             => trans('transport.vehicle_log_log'),
            'next_due_date'   => trans('transport.vehicle_service_record_next_due_date'),
            'next_due_log'    => trans('transport.vehicle_service_record_next_due_log'),
            'employee_id'     => trans('employee.employee')
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
