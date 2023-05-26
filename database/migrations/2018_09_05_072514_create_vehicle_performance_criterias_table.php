<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVehiclePerformanceCriteriasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vehicle_performance_criterias', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('vehicle_id')->unsigned()->nullable();
            $table->foreign('vehicle_id')->references('id')->on('vehicles')->onDelete('set null');
            $table->date('date_effective')->nullable();
            $table->decimal('min_mileage',25,5)->default(0);
            $table->decimal('max_mileage',25,5)->default(0);
            $table->decimal('min_service_charge',25,5)->default(0);
            $table->decimal('max_service_charge',25,5)->default(0);
            $table->integer('min_run')->default(0);
            $table->integer('max_run')->default(0);
            $table->text('description')->nullable();
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
        Schema::table('vehicle_performance_criterias', function(Blueprint $table)
        {
            $table->dropForeign('vehicle_performance_criterias_vehicle_id_foreign');
        });

        Schema::dropIfExists('vehicle_performance_criterias');
    }
}
