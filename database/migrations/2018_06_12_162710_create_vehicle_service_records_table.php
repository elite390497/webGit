<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVehicleServiceRecordsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vehicle_service_records', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('vehicle_id')->unsigned()->nullable();
            $table->foreign('vehicle_id')->references('id')->on('vehicles')->onDelete('cascade');
            $table->date('date_of_service')->nullable();
            $table->decimal('amount',25,5)->default(0);
            $table->integer('log')->default(0);
            $table->date('next_due_date')->nullable();
            $table->integer('next_due_log')->nullable();
            $table->text('description')->nullable();
            $table->bigInteger('employee_id')->unsigned()->nullable();
            $table->foreign('employee_id')->references('id')->on('employees')->onDelete('cascade');
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
        Schema::table('vehicle_service_records', function(Blueprint $table)
        {
            $table->dropForeign('vehicle_service_records_vehicle_id_foreign');
            $table->dropForeign('vehicle_service_records_employee_id_foreign');
        });
        
        Schema::dropIfExists('vehicle_service_records');
    }
}
