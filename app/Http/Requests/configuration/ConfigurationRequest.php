<?php

namespace App\Http\Requests\Configuration;

use Illuminate\Foundation\Http\FormRequest;

class ConfigurationRequest extends FormRequest
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
            'institute_name'                 => 'sometimes|required',
            'address_line_1'                 => 'sometimes|required',
            'country'                        => 'sometimes|required',
            'email'                          => 'sometimes|required',
            'driver'                         => 'sometimes|required',
            'from_name'                      => 'sometimes|required',
            'from_address'                   => 'sometimes|required',
            'smtp_host'                      => 'required_if:driver,smtp',
            'smtp_port'                      => 'required_if:driver,smtp',
            'smtp_username'                  => 'required_if:driver,smtp',
            'smtp_password'                  => 'required_if:driver,smtp',
            'mailgun_host'                   => 'required_if:driver,mailgun',
            'mailgun_port'                   => 'required_if:driver,mailgun',
            'mailgun_username'               => 'required_if:driver,mailgun',
            'mailgun_password'               => 'required_if:driver,mailgun',
            'mailgun_domain'                 => 'required_if:driver,mailgun',
            'mailgun_secret'                 => 'required_if:driver,mailgun',
            'mandrill_secret'                => 'required_if:driver,mandrill',
            'smtp_encryption'                => 'in:ssl,tls,'.config('system.hidden_field'),
            'mailgun_encryption'             => 'in:ssl,tls,'.config('system.hidden_field'),
            'config_type'                    => 'required',
            'token_lifetime'                 => 'sometimes|integer|min:10',
            'sms_gateway'                    => 'sometimes|required|in:nexmo,twilio,custom',
            'nexmo_api_key'                  => 'sometimes|required_if:sms_gateway,nexmo',
            'nexmo_api_secret'               => 'sometimes|required_if:sms_gateway,nexmo',
            'nexmo_sender_mobile'            => 'sometimes|required_if:sms_gateway,nexmo',
            'nexmo_receiver_mobile'          => 'sometimes|required_if:sms_gateway,nexmo',
            'twilio_sid'                     => 'sometimes|required_if:sms_gateway,twilio',
            'twilio_token'                   => 'sometimes|required_if:sms_gateway,twilio',
            'twilio_sender_mobile'           => 'sometimes|required_if:sms_gateway,twilio',
            'twilio_receiver_mobile'         => 'sometimes|required_if:sms_gateway,twilio',
            'custom_sms_api_get_url'         => 'sometimes|required_if:sms_gateway,custom|url',
            'custom_sms_api_sender_id_param' => 'sometimes|required_if:sms_gateway,custom',
            'custom_sms_api_sender_id'       => 'sometimes|required_if:sms_gateway,custom',
            'custom_sms_api_receiver_param'  => 'sometimes|required_if:sms_gateway,custom',
            'custom_sms_api_message_param'   => 'sometimes|required_if:sms_gateway,custom',
            'lock_screen_timeout'            => 'required_if:lock_screen,1|integer|min:1|max:120',
            'login_throttle_attempt'         => 'required_if:login_throttle,1|integer|min:1|max:10',
            'login_throttle_timeout'         => 'required_if:login_throttle,1|integer|min:1|max:300',
            'reset_password_token_lifetime'  => 'sometimes|integer|min:5|max:300',
            'library_max_book_issue_to_student'   => 'sometimes|integer|min:0',
            'library_max_book_issue_to_employee'  => 'sometimes|integer|min:0',
            'library_return_due_day_for_student'  => 'sometimes|integer|min:0',
            'library_return_due_day_for_employee' => 'sometimes|integer|min:0',
            'library_late_fee_charge_student'     => 'sometimes|integer|min:0',
            'library_late_fee_charge_employee'    => 'sometimes|integer|min:0',
            'employee_code_prefix'                => 'sometimes|max:5',
            'employee_code_digit'                 => 'sometimes|integer|min:1',
            'days_allowed_to_modify_student_attendance' => 'required_if:allow_to_modify_student_attendance,1|integer|min:1',
            'days_allowed_to_mark_student_advance_attendance' => 'required_if:allow_to_mark_student_advance_attendance,1|integer|min:1',
            'student_late_attendance_time' => 'sometimes|integer|min:1',
            'facebook_link'    => 'sometimes|url',
            'twitter_link'     => 'sometimes|url',
            'linkedin_link'    => 'sometimes|url',
            'google_plus_link' => 'sometimes|url',
            'youtube_link'     => 'sometimes|url',
            'paypal_client_id'       => 'required_if:paypal,1',
            'paypal_client_secret'   => 'required_if:paypal,1',
            'paypal_handling_fee'    => 'required_if:paypal_charge_handling_fee,1|numeric|min:0',
            'stripe_publishable_key' => 'required_if:stripe,1',
            'stripe_private_key'     => 'required_if:stripe,1',
            'stripe_handling_fee'    => 'required_if:stripe_charge_handling_fee,1|numeric|min:0',
            'razorpay_key'           => 'required_if:razorpay,1',
            'razorpay_secret'        => 'required_if:razorpay,1',
            'razorpay_handling_fee'  => 'required_if:razorpay_charge_handling_fee,1|numeric|min:0',
            'payumoney_key'          => 'required_if:payumoney,1',
            'payumoney_salt'         => 'required_if:payumoney,1',
            'payumoney_handling_fee' => 'required_if:payumoney_charge_handling_fee,1|numeric|min:0',
            'user_defined_per_day_salary_calculation_basis' => 'required_if:per_day_salary_calculation_basis,user_defined|min:1|numeric'
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
            'institute_name'                 => trans('configuration.institute_name'),
            'address_line_1'                 => trans('configuration.address_line_1'),
            'city'                           => trans('configuration.city'),
            'state'                          => trans('configuration.state'),
            'email'                          => trans('configuration.email'),
            'driver'                         => trans('configuration.mail_driver'),
            'from_name'                      => trans('configuration.mail_from_name'),
            'from_address'                   => trans('configuration.mail_from_address'),
            'smtp_host'                      => trans('configuration.smtp_host'),
            'smtp_port'                      => trans('configuration.smtp_port'),
            'smtp_username'                  => trans('configuration.smtp_username'),
            'smtp_password'                  => trans('configuration.smtp_password'),
            'mailgun_host'                   => trans('configuration.mailgun_host'),
            'mailgun_port'                   => trans('configuration.mailgun_port'),
            'mailgun_username'               => trans('configuration.mailgun_username'),
            'mailgun_password'               => trans('configuration.mailgun_password'),
            'mailgun_domain'                 => trans('configuration.mailgun_domain'),
            'mailgun_secret'                 => trans('configuration.mailgun_secret'),
            'mandrill_secret'                => trans('configuration.mandrill_secret'),
            'smtp_encryption'                => trans('configuration.smtp_encryption'),
            'mailgun_encryption'             => trans('configuration.mailgun_encryption'),
            'token_lifetime'                 => trans('auth.token_lifetime'),
            'sms_gateway'                    => trans('configuration.sms_gateway'),
            'nexmo_api_key'                  => trans('configuration.nexmo_api_key'),
            'nexmo_api_secret'               => trans('configuration.nexmo_api_secret'),
            'nexmo_sender_mobile'            => trans('configuration.sender_mobile'),
            'nexmo_receiver_mobile'          => trans('configuration.receiver_mobile'),
            'twilio_sid'                     => trans('configuration.twilio_sid'),
            'twilio_token'                   => trans('configuration.twilio_token'),
            'twilio_sender_mobile'           => trans('configuration.sender_mobile'),
            'twilio_receiver_mobile'         => trans('configuration.receiver_mobile'),
            'custom_sms_api_get_url'         => trans('configuration.custom_sms_api_get_url'),
            'custom_sms_api_sender_id_param' => trans('configuration.custom_sms_api_sender_id_param'),
            'custom_sms_api_sender_id'       => trans('configuration.custom_sms_api_sender_id'),
            'custom_sms_api_receiver_param'  => trans('configuration.custom_sms_api_receiver_param'),
            'custom_sms_api_message_param'   => trans('configuration.custom_sms_api_message_param'),
            'lock_screen_timeout'           => trans('auth.lock_screen_timeout'),
            'login_throttle_attempt'        => trans('auth.login_throttle_attempt'),
            'login_throttle_timeout'        => trans('auth.login_throttle_timeout'),
            'reset_password_token_lifetime' => trans('auth.reset_password_token_lifetime'),
            'library_max_book_issue_to_student'   => trans('library.library_max_book_issue_to_student'),
            'library_max_book_issue_to_employee'  => trans('library.library_max_book_issue_to_employee'),
            'library_return_due_day_for_student'  => trans('library.library_return_due_day_for_student'),
            'library_return_due_day_for_employee' => trans('library.library_return_due_day_for_employee'),
            'library_late_fee_charge_student'     => trans('library.library_late_fee_charge_student'),
            'library_late_fee_charge_employee'    => trans('library.library_late_fee_charge_employee'),
            'employee_code_prefix'                => trans('employee.employee_code_prefix'),
            'employee_code_digit'                 => trans('employee.employee_code_digit'),
            'days_allowed_to_modify_student_attendance'       => trans('student.days_allowed_to_modify_student_attendance'),
            'days_allowed_to_mark_student_advance_attendance' => trans('student.days_allowed_to_mark_student_advance_attendance'),
            'facebook_link'    => trans('configuration.social_network_link', ["name" => "Facebook"]),
            'twitter_link'     => trans('configuration.social_network_link', ["name" => "Twitter"]),
            'linkedin_link'    => trans('configuration.social_network_link', ["name" => "LinkedIn"]),
            'google_plus_link' => trans('configuration.social_network_link', ["name" => "Google Plus"]),
            'youtube_link'     => trans('configuration.social_network_link', ["name" => "Youtube"]),
            'user_defined_per_day_salary_calculation_basis' => trans('employee.user_defined_per_day_salary_calculation_basis')
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
            'smtp_host.required_if'              => trans('validation.required', ['attribute' => trans('configuration.smtp_host')]),
            'smtp_port.required_if'              => trans('validation.required', ['attribute' => trans('configuration.smtp_port')]),
            'smtp_username.required_if'          => trans('validation.required', ['attribute' => trans('configuration.smtp_username')]),
            'smtp_password.required_if'          => trans('validation.required', ['attribute' => trans('configuration.smtp_password')]),
            'mailgun_host.required_if'           => trans('validation.required', ['attribute' => trans('configuration.mailgun_host')]),
            'mailgun_port.required_if'           => trans('validation.required', ['attribute' => trans('configuration.mailgun_port')]),
            'mailgun_username.required_if'       => trans('validation.required', ['attribute' => trans('configuration.mailgun_username')]),
            'mailgun_password.required_if'       => trans('validation.required', ['attribute' => trans('configuration.mailgun_password')]),
            'mailgun_domain.required_if'         => trans('validation.required', ['attribute' => trans('configuration.mailgun_domain')]),
            'mailgun_secret.required_if'         => trans('validation.required', ['attribute' => trans('configuration.mailgun_secret')]),
            'mandrill_secret.required_if'        => trans('validation.required', ['attribute' => trans('configuration.mandrill_secret')]),
            'lock_screen_timeout.required_if'    => trans('validation.required', ['attribute' => trans('auth.lock_screen_timeout')]),
            'login_throttle_timeout.required_if' => trans('validation.required', ['attribute' => trans('auth.login_throttle_timeout')]),
            'days_allowed_to_modify_student_attendance.required_if' => trans('validation.required', ['attribute' => trans('student.days_allowed_to_modify_student_attendance')]),
            'days_allowed_to_mark_student_advance_attendance.required_if' => trans('validation.required', ['attribute' => trans('student.days_allowed_to_mark_student_advance_attendance')]),
            'nexmo_api_key.required_if'                  => trans('validation.required', ['attribute' => trans('configuration.nexmo_api_key')]),
            'nexmo_api_secret.required_if'               => trans('validation.required', ['attribute' => trans('configuration.nexmo_api_secret')]),
            'nexmo_sender_mobile.required_if'            => trans('validation.required', ['attribute' => trans('configuration.nexmo_sender_mobile')]),
            'nexmo_receiver_mobile.required_if'          => trans('validation.required', ['attribute' => trans('configuration.nexmo_receiver_mobile')]),
            'twilio_sid.required_if'                     => trans('validation.required', ['attribute' => trans('configuration.twilio_sid')]),
            'twilio_token.required_if'                   => trans('validation.required', ['attribute' => trans('configuration.twilio_token')]),
            'twilio_sender_mobile.required_if'           => trans('validation.required', ['attribute' => trans('configuration.twilio_sender_mobile')]),
            'twilio_receiver_mobile.required_if'         => trans('validation.required', ['attribute' => trans('configuration.twilio_receiver_mobile')]),
            'custom_sms_api_get_url.required_if'         => trans('validation.required', ['attribute' => trans('configuration.custom_sms_api_get_url')]),
            'custom_sms_api_sender_id_param.required_if' => trans('validation.required', ['attribute' => trans('configuration.custom_sms_api_sender_id_param')]),
            'custom_sms_api_sender_id.required_if'       => trans('validation.required', ['attribute' => trans('configuration.custom_sms_api_sender_id')]),
            'custom_sms_api_receiver_param.required_if'  => trans('validation.required', ['attribute' => trans('configuration.custom_sms_api_receiver_param')]),
            'custom_sms_api_message_param.required_if'   => trans('validation.required', ['attribute' => trans('configuration.custom_sms_api_message_param')]),
            'user_defined_per_day_salary_calculation_basis' => trans('validation.required', ['attribute' => trans('employee.user_defined_per_day_salary_calculation_basis')])
        ];
    }
}
