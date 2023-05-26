<?php

namespace App\Console\Commands;

use App\Jobs\SendMail;
use Illuminate\Console\Command;
use App\Repositories\Configuration\ConfigurationRepository;

class SendWish extends Command
{
    protected $config;

    /**
     *  This command is used send birthday & anniversary wishesh to users
     */

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'send-wish';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send Birthday & Anniversary wishes to users';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(
        ConfigurationRepository $config
    ) {
        $this->config = $config;
        
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $this->config->setDefault();

        if (isTestMode()) {
            $this->error(trans('general.restricted_test_mode_action'));
            return;
        }

        $this->info(trans('general.command_completed'));
    }
}
