<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBillsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bills', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('uuid');
            $table->string('bill_number')->nullable();
            $table->bigInteger('vendor_id')->unsigned()->nullable();
            $table->foreign('vendor_id')->references('id')->on('vehicles')->onDelete('cascade');
            $table->bigInteger('vehicle_id')->unsigned()->nullable();
            $table->foreign('vehicle_id')->references('id')->on('vehicles')->onDelete('cascade');
            $table->string('type')->nullable();
            $table->date('date')->nullable();
            $table->date('next_service_date')->nullable();
            $table->string('reference_number')->nullable();
            $table->text('subject')->nullable();
            $table->text('description')->nullable();
            $table->text('tnc')->nullable();
            $table->text('memo')->nullable();
            $table->bigInteger('employee_id')->unsigned()->nullable();
            $table->foreign('employee_id')->references('id')->on('employees')->onDelete('cascade');
            $table->decimal('subtotal_discount',25,5)->default(0);
            $table->decimal('subtotal_tax',25,5)->default(0);
            $table->decimal('subtotal_handling',25,5)->default(0);
            $table->decimal('subtotal_total',25,5)->default(0);
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
        Schema::table('bills', function(Blueprint $table)
        {
            $table->dropForeign('bills_vendor_id_foreign');
            $table->dropForeign('bills_vehicle_id_foreign');
            $table->dropForeign('bills_employee_id_foreign');
        });
        
        Schema::dropIfExists('bills');
    }
}
