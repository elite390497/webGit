<?php

namespace App\Jobs;

use App\Traits\SMSSender;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use App\Repositories\Configuration\ConfigurationRepository;

class SendSMS implements ShouldQueue
{
    protected $numbers;
    protected $sms;

    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, SMSSender;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(
        $numbers,
        $sms
    ) {
        $this->numbers = $numbers;
        $this->sms = $sms;
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

        if (config('config.custom_sms_api_accepts_multiple_receiver')) {

            $to = array();
            foreach ($this->numbers as $number) {
                $to[] =  $prefix.$number;
            }

            $to = implode(',', $to);
        
            $this->send([
                'to' => $to,
                'sms' => $this->sms
            ]);
            
        } else {

            foreach ($this->numbers as $number) {
                $this->send([
                    'to' => $prefix.$number,
                    'sms' => $this->sms
                ]);
            }

        }
    }
}
