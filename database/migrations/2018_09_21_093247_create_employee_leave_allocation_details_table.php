<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEmployeeLeaveAllocationDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('employee_leave_allocation_details', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('employee_leave_allocation_id')->unsigned()->nullable();
            $table->foreign('employee_leave_allocation_id','elad_employee_leave_allocation_id_foreign')->references('id')->on('employee_leave_allocations')->onDelete('cascade');
            $table->bigInteger('employee_leave_type_id')->unsigned()->nullable();
            $table->foreign('employee_leave_type_id','elad_employee_leave_type_id_foreign')->references('id')->on('employee_leave_types')->onDelete('cascade');
            $table->integer('allotted')->default(0);
            $table->integer('used')->default(0);
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
        Schema::table('employee_leave_allocation_details', function(Blueprint $table)
        {
            $table->dropForeign('elad_employee_leave_allocation_id_foreign');
            $table->dropForeign('elad_employee_leave_type_id_foreign');
        });

        Schema::dropIfExists('employee_leave_allocation_details');
    }
}
