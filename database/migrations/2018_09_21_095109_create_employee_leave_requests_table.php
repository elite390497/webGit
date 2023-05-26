<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEmployeeLeaveRequestsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('employee_leave_requests', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('uuid')->nullable();
            $table->bigInteger('employee_id')->unsigned()->nullable();
            $table->foreign('employee_id','elr_employee_id_foreign')->references('id')->on('employees')->onDelete('cascade');
            $table->bigInteger('employee_leave_type_id')->unsigned()->nullable();
            $table->foreign('employee_leave_type_id','elr_employee_leave_type_id_foreign')->references('id')->on('employee_leave_types')->onDelete('cascade');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->text('reason')->nullable();
            $table->string('status',20)->nullable();
            $table->bigInteger('requester_user_id')->unsigned()->nullable();
            $table->foreign('requester_user_id','elr_requester_user_id_foreign')->references('id')->on('users')->onDelete('cascade');
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
        Schema::table('employee_leave_requests', function(Blueprint $table)
        {
            $table->dropForeign('elr_employee_id_foreign');
            $table->dropForeign('elr_employee_leave_type_id_foreign');
            $table->dropForeign('elr_requester_user_id_foreign');
        });

        Schema::dropIfExists('employee_leave_requests');
    }
}
