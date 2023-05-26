<?php

namespace App\Http\Requests\Inventory;

use Illuminate\Foundation\Http\FormRequest;

class StockItemRequest extends FormRequest
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
            'opening_quantity' => 'numeric|min:0'
        ];

        $id = $this->route('id');

        if ($this->method() === 'POST') {
            $rules['name'] = 'required|unique:stock_items';
            $rules['code'] = 'nullable|unique:stock_items';
        } elseif ($this->method() === 'PATCH') {
            $rules['name'] = 'required|unique:stock_items,name,'.$id.',id';
            $rules['code'] = 'nullable|unique:stock_items,code,'.$id.',id';
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
            'name' => trans('inventory.stock_item_name'),
            'opening_quantity' => trans('inventory.stock_item_opening_quantity'),
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