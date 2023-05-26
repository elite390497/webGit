<?php

namespace App\Http\Requests\Student;

use Illuminate\Foundation\Http\FormRequest;

class OnlineRegistrationRequest extends FormRequest {
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

        $relations = implode(',', gv(getVar('list'), 'relations', []));

		return [
			'first_name'                      => 'required|min:2',
			// 'last_name'                       => 'required|min:2',
			'date_of_birth'                   => 'required|date',
			'contact_number'                  => 'required',
			'gender'                          => 'required',
			'first_guardian_name'             => 'required',
			'first_guardian_relation'         => 'required|different:second_guardian_relation|in:'.$relations,
			'second_guardian_name'            => 'required',
			'second_guardian_relation'        => 'required|different:first_guardian_relation|in:'.$relations,
			'first_guardian_email'            => 'email',
			'first_guardian_contact_number_1' => 'required',
			'course_id'                       => 'required',
			'address_line_1'                  => 'required',
			'city'                            => 'required',
			'state'                           => 'required',
			'zipcode'                         => 'required',
			'country'                         => 'required',
		];
	}

	/**
	 * Translate fields with user friendly name.
	 *
	 * @return array
	 */
	public function attributes() {
		return [
			'first_name'                      => trans('student.first_name'),
			'last_name'                       => trans('student.last_name'),
			'date_of_birth'                   => trans('student.date_of_birth'),
			'contact_number'                  => trans('student.contact_number'),
			'gender'                          => trans('student.gender'),
			'first_guardian_name'             => trans('student.first_guardian_name'),
			'second_guardian_name'            => trans('student.second_guardian_name'),
			'first_guardian_email'            => trans('student.first_guardian_email'),
			'first_guardian_contact_number_1' => trans('student.first_guardian_contact_number'),
			'course_id'                       => trans('academic.course'),
			'address_line_1'                  => trans('student.address_line_1'),
			'city'                            => trans('student.city'),
			'state'                           => trans('student.state'),
			'zipcode'                         => trans('student.zipcode'),
			'country'                         => trans('student.country'),
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
            'first_guardian_relation.different' => trans('general.different_custom', ['attribute' => trans('general.relation')]),
            'second_guardian_relation.different' => trans('general.different_custom', ['attribute' => trans('general.relation')])
        ];
    }
}
