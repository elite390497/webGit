<?php

namespace App\Console\Commands;

use App\Repositories\Configuration\LocaleRepository;
use Illuminate\Console\Command;

class SortLocale extends Command
{
    private $locale;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sort-locale';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sort locale command';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(LocaleRepository $locale)
    {
        $this->locale = $locale;
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $locale = 'en';
        foreach ($this->locale->getModules() as $module) {
            $words = \File::getRequire($this->locale->validateModule($locale, $module));
            ksort($words);
            $this->locale->writeToFile('en', $module, $words);
        }
    }
}
