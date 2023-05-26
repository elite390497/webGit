<?php

namespace App\Http\Requests\Calendar;

use Illuminate\Foundation\Http\FormRequest;

class HolidayRequest extends FormRequest
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

        $rules['description'] = 'required|min:5';
        
        if ($this->method() === 'POST') {
            $rules ['dates'] = 'required|array|min:1';
        } elseif ($this->method() === 'PATCH') {
            $rules ['date'] = 'required|date';
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
            'description' => trans('calendar.holiday_description'),
            'dates'       => trans('calendar.holiday_date'),
            'date'        => trans('calendar.holiday_date')
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
