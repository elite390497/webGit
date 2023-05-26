<?php

namespace App\Http\Requests\Exam;

use Illuminate\Foundation\Http\FormRequest;

class OnlineExamRequest extends FormRequest
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
            'name' => 'required',
            'batch_id' => 'required',
            'subject_id' => 'required',
            'exam_type' => 'required',
            'date' => 'required|date',
            'passing_percentage' => 'required|numeric|min:0|max:100',
            'negative_mark_percentage_per_question' => 'required_if:is_negative_mark_applicable,1|numeric|min:0|max:100'
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
            'name' => trans('exam.online_exam_name'),
            'exam_type' => trans('exam.online_exam_type'),
            'batch_id' => trans('academic.batch'),
            'subject_id' => trans('academic.subject'),
            'date' => trans('exam.online_exam_date'),
            'passing_percentage' => trans('exam.online_exam_passing_percentage'),
            'negative_mark_percentage_per_question' => trans('exam.online_exam_negative_mark_percentage_per_question')
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
            'negative_mark_percentage_per_question.required_if' => trans('validation.required', ['attribute' => trans('exam.online_exam_negative_mark_percentage_per_question')])
        ];
    }
}