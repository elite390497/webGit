<?php

namespace App\Http\Requests\Inventory;

use Illuminate\Foundation\Http\FormRequest;

class VendorRequest extends FormRequest
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
        $id = $this->route('id');

        $rules = [
            'phone'                => 'required',
            'email'                => 'email',
            'contact_person_email' => 'email',
            'address_line_1'       => 'required',
            'city'                 => 'required',
            'state'                => 'required',
            'zipcode'              => 'required',
            'country'              => 'required',
        ];
        
        if ($this->method() === 'POST') {
            $rules['name'] = 'required|unique:vendors';
        } elseif ($this->method() === 'PATCH') {
            $rules['name'] = 'required|unique:vendors,name,'.$id.',id';
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
            'name'                 => trans('inventory.vendor_name'),
            'phone'                => trans('inventory.vendor_phone'),
            'email'                => trans('inventory.vendor_email'),
            'contact_person_email' => trans('inventory.vendor_contact_person_email'),
            'city'                 => trans('inventory.vendor_city'),
            'address_line_1'       => trans('inventory.vendor_address_line_1'),
            'state'                => trans('inventory.vendor_state'),
            'zipcode'              => trans('inventory.vendor_zipcode'),
            'country'              => trans('inventory.vendor_country'),
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