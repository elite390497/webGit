<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEmployeeLeaveRequestDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('employee_leave_request_details', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('employee_leave_request_id')->unsigned()->nullable();
            $table->foreign('employee_leave_request_id','elrd_employee_leave_request_id_foreign')->references('id')->on('employee_leave_requests')->onDelete('cascade');
            $table->bigInteger('designation_id')->unsigned()->nullable();
            $table->foreign('designation_id','elrd_designation_id_foreign')->references('id')->on('designations')->onDelete('cascade');
            $table->date('date_of_action')->nullable();
            $table->string('status',20)->nullable();
            $table->text('comment')->nullable();
            $table->bigInteger('approver_user_id')->unsigned()->nullable();
            $table->foreign('approver_user_id','elrd_approver_user_id_foreign')->references('id')->on('users')->onDelete('cascade');
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
        Schema::table('employee_leave_request_details', function(Blueprint $table)
        {
            $table->dropForeign('elrd_employee_leave_request_id_foreign');
            $table->dropForeign('elrd_designation_id_foreign');
            $table->dropForeign('elrd_approver_user_id_foreign');
        });

        Schema::dropIfExists('employee_leave_request_details');
    }
}
