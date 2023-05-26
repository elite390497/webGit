<?php

namespace App\Jobs;

use App\Traits\SMSSender;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use App\Repositories\Configuration\ConfigurationRepository;

class SendCustomizedSMS implements ShouldQueue
{
    protected $data;

    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, SMSSender;

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
    public function handle(ConfigurationRepository $config)
    {
        $config->setDefault();

        $prefix = (config('config.sms_gateway') == 'custom' && config('config.custom_sms_api_number_prefix')) ? config('config.custom_sms_api_number_prefix') : '';

        foreach ($this->data as $item) {
            $this->send([
                'to' => $prefix.$item['to'],
                'sms' => $item['sms']
            ]);
        }
    }
}
