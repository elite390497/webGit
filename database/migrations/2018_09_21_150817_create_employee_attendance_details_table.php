<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEmployeeAttendanceDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('employee_attendance_details', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('employee_attendance_id')->unsigned()->nullable();
            $table->foreign('employee_attendance_id','ead_employee_attendance_id_foreign')->references('id')->on('employee_attendances')->onDelete('cascade');
            $table->bigInteger('employee_attendance_type_id')->unsigned()->nullable();
            $table->foreign('employee_attendance_type_id','ead_employee_attendance_type_id_foreign')->references('id')->on('employee_attendance_types')->onDelete('cascade');
            $table->decimal('value',25,5)->nullable();
            $table->text('remarks')->nullable();
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
        Schema::table('employee_attendance_details', function(Blueprint $table)
        {
            $table->dropForeign('ead_employee_attendance_id_foreign');
            $table->dropForeign('ead_employee_attendance_type_id_foreign');
        });

        Schema::dropIfExists('employee_attendance_details');
    }
}
