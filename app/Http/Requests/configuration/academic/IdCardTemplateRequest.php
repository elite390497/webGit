<?php

namespace App\Http\Requests\Configuration\Academic;

use Illuminate\Foundation\Http\FormRequest;

class IdCardTemplateRequest extends FormRequest {
	/**
	 * Determine if the user is authorized to make this request.
	 *
	 * @return bool
	 */
	public function authorize() {
		return true;
	}

	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array
	 */
	public function rules() {
		$id = $this->route('id');

		$rules = [];

		if ($this->method() === 'POST') {
			$rules['name'] = 'required|unique:id_card_templates';
		} elseif ($this->method() === 'PATCH') {
			$rules['name'] = 'required|unique:id_card_templates,name,' . $id . ',id';
		}

		$rule['type'] = 'required|in:student,employee';
		$rule['height'] = 'required|integer|min:1';
		$rule['width'] = 'required|integer|min:1';
		$rule['per_page_limit'] = 'required|integer|min:1';

		return $rules;
	}

	/**
	 * Translate fields with user friendly name.
	 *
	 * @return array
	 */
	public function attributes() {
		return [
			'name' => trans('academic.id_card_template_name'),
			'type' => trans('academic.id_card_template_type'),
		];
	}

	/**
	 * Get the error messages for the defined validation rules.
	 *
	 * @return array
	 */
	public function messages() {
		return [
		];
	}
}
