<?php

namespace App\Traits;

use Twilio\Exceptions\TwilioException;

trait SMSSender
{
    public function send($params)
    {
        if (! config('config.sms_gateway'))
            return;

        if (config('config.sms_gateway') == 'custom') {

            $url = config('config.custom_sms_api_get_url');
            $sender_id_param = config('config.custom_sms_api_sender_id_param');
            $sender_id = config('config.custom_sms_api_sender_id');
            $receiver_param = config('config.custom_sms_api_receiver_param');
            $message_param = config('config.custom_sms_api_message_param');

            $to = gv($params, 'to');
            $sms = gv($params, 'sms');
            $sms = urlencode($sms);

            $url = $url.'&'.$sender_id_param.'='.$sender_id.'&'.$receiver_param.'='.$to.'&'.$message_param.'='.$sms;

            curlIt($url);

        } else if (config('config.sms_gateway') == 'nexmo') {

            try {
                $nexmo = app('Nexmo\Client');
                $nexmo->message()->send([
                    'to'   => gv($params, 'to'),
                    'from' => config('config.nexmo_sender_mobile'),
                    'text' => gv($params, 'sms')
                ]);
            } catch (\Nexmo\Client\Exception\Request $e) {
                
            }

        } else if (config('config.sms_gateway') == 'twilio') {
            
            try {
                \Twilio::message('+'.gv($params, 'to'), gv($params, 'sms'));
            } catch (TwilioException $e) {
                
            }
        }
    }
}