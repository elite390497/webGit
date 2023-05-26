<?php
namespace Mint\Service\Repositories;

class SupportRepository
{
    public function submit($params)
    {
        $subject                = isset($params['subject']) ? $params['subject'] : null;
        $body                   = isset($params['body']) ? $params['body'] : null;
        $purchase_code          = isset($params['purchase_code']) ? $params['purchase_code'] : null;
        $product_name           = isset($params['product_name']) ? $params['product_name'] : null;
        $date_of_support_expiry = isset($params['date_of_support_expiry']) ? $params['date_of_support_expiry'] : null;

        $requester_email = \Storage::get('.account_email');
        $item = config('app.item');
        $url = url()->current();
        $ip = getClientIp();

        \Mail::send('emails.default.support', compact('subject', 'body', 'requester_email', 'purchase_code', 'url', 'ip', 'product_name', 'date_of_support_expiry'), function ($message) {
            $message->to('hello@scriptmint.com')->subject('ScriptMint Support Request');
        });
    }
}
