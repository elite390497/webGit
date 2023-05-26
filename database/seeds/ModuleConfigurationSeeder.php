<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ModuleConfigurationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $module_configurations = getSeedVar('module_config');
        
        foreach($module_configurations as $key => $module_configuration) {
        	DB::table($key)->insert($module_configuration);
        }
    }
}
