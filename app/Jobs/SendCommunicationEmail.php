<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use App\Repositories\Configuration\ConfigurationRepository;

class SendCommunicationEmail implements ShouldQueue
{
    protected $emails;
    protected $params;

    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($emails, $params)
    {
        $this->emails = $emails;
        $this->params = $params;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle(ConfigurationRepository $config)
    {
        $config->setDefault();

        $body = clean(gv($this->params, 'body'));
        $subject = gv($this->params, 'subject');

        foreach ($this->emails as $email) {
            \Mail::send('emails.email', compact('body'), function ($message) use ($email, $subject) {
                $message->to($email)->subject($subject);
            });
        }
    }
}
