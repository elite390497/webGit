<?php

namespace App\Http\Requests\Transport\Vehicle;

use Illuminate\Foundation\Http\FormRequest;

class VehicleRequest extends FormRequest
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
        $rules = [
            'max_seating_capacity' => 'required|integer',
            'max_allowed'          => 'required|integer',
            'owner_name'           => 'required',
            'owner_company_name'   => 'required',
            'owner_phone'          => 'required',
            'owner_email'          => 'required',
            'vehicle_fuel_type_id' => 'required',
            'max_fuel_capacity'    => 'required|min:0|numeric'
        ];

        $id = $this->route('id');

        if ($this->method() === 'POST') {
            $rules['name'] = 'required|unique:vehicles';
            $rules['registration_number'] = 'required|unique:vehicles';
        } elseif ($this->method() === 'PATCH') {
            $rules['name'] = 'required|unique:vehicles,name,'.$id.',id';
            $rules['registration_number'] = 'required|unique:vehicles,registration_number,'.$id.',id';
        }

        return $rules;
    }

    /**
     * Translate fields with user friendly name.
     *
     * @return array
     */
    public function attributes()
    {
        return [
            'name'                 => trans('transport.vehicle_name'),
            'registration_number'  => trans('transport.vehicle_registration_number'),
            'max_seating_capacity' => trans('transport.vehicle_max_seating_capacity'),
            'max_allowed'          => trans('transport.vehicle_max_allowed'),
            'is_owned'             => trans('transport.vehicle_is_owned'),
            'owner_name'           => trans('transport.vehicle_owner_name'),
            'owner_company_name'   => trans('transport.vehicle_owner_company_name'),
            'owner_phone'          => trans('transport.vehicle_owner_phone'),
            'owner_email'          => trans('transport.vehicle_owner_email'),
            'vehicle_fuel_type_id' => trans('transport.vehicle_fuel_type'),
            'max_fuel_capacity'    => trans('transport.max_fuel_capacity')
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
