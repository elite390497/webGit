<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCommunicationEmployeeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('communication_employee', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('communication_id')->unsigned()->nullable();
            $table->foreign('communication_id', 'ce_communication_id')->references('id')->on('communications')->onDelete('cascade');
            $table->bigInteger('employee_id')->unsigned()->nullable();
            $table->foreign('employee_id', 'ce_employee_id')->references('id')->on('employees')->onDelete('cascade');
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
        Schema::table('communication_employee', function(Blueprint $table)
        {
            $table->dropForeign('ce_communication_id');
            $table->dropForeign('ce_employee_id');
        });
        
        Schema::dropIfExists('communication_employee');
    }
}
