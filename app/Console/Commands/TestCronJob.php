<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Repositories\Configuration\ConfigurationRepository;

class TestCronJob extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test-cron-job';
    protected $config;

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Testing cron job';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(ConfigurationRepository $config)
    {
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

        \Storage::disk('public')->append('/cron.txt', 'Cron job runs at '. showDateTime(now()));
        $this->info('Cron job runs at '. showDateTime(now()));
    }
}
