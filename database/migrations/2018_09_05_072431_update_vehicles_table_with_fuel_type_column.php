<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateVehiclesTableWithFuelTypeColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('vehicles', function ($table) {
            $table->bigInteger('vehicle_fuel_type_id')->unsigned()->nullable()->after('owner_email');
            $table->foreign('vehicle_fuel_type_id')->references('id')->on('vehicle_fuel_types')->onDelete('set null');
            $table->decimal('max_fuel_capacity',25,5)->default(0)->after('vehicle_fuel_type_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('vehicles', function ($table) {
            $table->dropForeign('vehicles_vehicle_fuel_type_id_foreign');
            $table->dropColumn('vehicle_fuel_type_id');
            $table->dropColumn('max_fuel_capacity');
        });
    }
}
