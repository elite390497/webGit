<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVehicleFuelsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vehicle_fuels', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('vehicle_id')->unsigned()->nullable();
            $table->foreign('vehicle_id')->references('id')->on('vehicles')->onDelete('cascade');
            $table->decimal('quantity',25,5)->default(0);
            $table->decimal('price_per_unit',25,5)->default(0);
            $table->bigInteger('vehicle_fuel_type_id')->unsigned()->nullable();
            $table->foreign('vehicle_fuel_type_id')->references('id')->on('vehicle_fuel_types')->onDelete('cascade');
            $table->date('date_of_fueling')->nullable();
            $table->text('description')->nullable();
            $table->uuid('upload_token')->nullable();
            $table->text('options')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('vehicle_fuels', function(Blueprint $table)
        {
            $table->dropForeign('vehicle_fuels_vehicle_id_foreign');
            $table->dropForeign('vehicle_fuels_vehicle_fuel_type_id_foreign');
        });
        
        Schema::dropIfExists('vehicle_fuels');
    }
}
