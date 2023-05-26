<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Mint\Service\Repositories\PushNotificationRepository;
use App\Repositories\Configuration\ConfigurationRepository;

class SendPushNotification implements ShouldQueue
{
    protected $data;

    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(
        $data
    ) {
        $this->data = $data;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle(ConfigurationRepository $config, PushNotificationRepository $push_notification)
    {
        $config->setDefault();

        $tokens = gv($this->data, 'tokens', []);
        
        foreach (array_chunk($tokens, config('config.max_push_notification_per_chunk')) as $chunk) {
            $push_notification->send([
                'pusher_auth_token' => gv($this->data, 'pusher_auth_token'),
                'title'             => gv($this->data, 'title'),
                'body'              => gv($this->data, 'body'),
                'tokens'            => $chunk,
                'url'               => gv($this->data, 'url')
            ]);
        }
    }
}