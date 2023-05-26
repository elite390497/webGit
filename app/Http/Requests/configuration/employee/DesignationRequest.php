<?php

namespace App\Http\Requests\Configuration\Employee;

use Illuminate\Foundation\Http\FormRequest;

class DesignationRequest extends FormRequest
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
            'employee_category_id' => 'required'
        ];
        
        if ($this->method() === 'POST') {
            $rules['name'] = 'required|unique:designations';
        } elseif ($this->method() === 'PATCH') {
            $rules['name'] = 'required|unique:designations,name,'.$id.',id';
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
            'employee_category_id' => trans('employee.category'),
            'name' => trans('employee.designation')
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
