<?php

namespace App\Http\Requests\Inventory;

use Illuminate\Foundation\Http\FormRequest;

class StockTransferReturnRequest extends FormRequest
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
            'type' => 'required|in:consumed,damaged,returned,missed',
            'date' => 'required|date',
            'quantity' => 'required|integer|min:1',
            'stock_item_id' => 'required'
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
            'type' => trans('inventory.stock_transfer_return_type'),
            'date' => trans('inventory.stock_transfer_return_date'),
            'quantity' => trans('inventory.stock_transfer_quantity'),
            'stock_item_id' => trans('inventory.stock_item')
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