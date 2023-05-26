<?php

namespace App\Http\Requests\Configuration\Employee;

use Illuminate\Foundation\Http\FormRequest;

class PayHeadRequest extends FormRequest
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
            'type' => 'required|in:earning,deduction'
        ];
        
        if ($this->method() === 'POST') {
            $rules['name'] = 'required|unique:pay_heads';
            $rules['alias'] = 'required|unique:pay_heads';
        } elseif ($this->method() === 'PATCH') {
            $rules['name'] = 'required|unique:pay_heads,name,'.$id.',id';
            $rules['alias'] = 'required|unique:pay_heads,alias,'.$id.',id';
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
            'name' => trans('employee.pay_head_name'),
            'alias' => trans('employee.pay_head_alias'),
            'type' => trans('employee.pay_head_type')
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
