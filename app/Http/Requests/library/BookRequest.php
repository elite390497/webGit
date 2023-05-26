<?php

namespace App\Http\Requests\Library;

use Illuminate\Foundation\Http\FormRequest;

class BookRequest extends FormRequest
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
            'type'              => 'required|in:reference,text',
            'title'             => 'required',
            'book_author_id'    => 'required',
            'book_language_id'  => 'required',
            'book_publisher_id' => 'required',
            'book_topic_id'     => 'required',
            'page'              => 'required|integer|min:1',
            'price'             => 'integer|min:0'
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
            'type'              => trans('library.book_type'),
            'title'             => trans('library.book_title'),
            'book_author_id'    => trans('library.book_author'),
            'book_language_id'  => trans('library.book_language'),
            'book_publisher_id' => trans('library.book_publisher'),
            'book_topic_id'     => trans('library.book_topic'),
            'page'              => trans('library.book_page'),
            'price'             => trans('library.book_price')
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
