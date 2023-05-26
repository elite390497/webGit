<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEmployeeAttendancesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('employee_attendances', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('employee_id')->unsigned()->nullable();
            $table->foreign('employee_id','ea_employee_id_foreign')->references('id')->on('employees')->onDelete('cascade');
            $table->date('date_of_attendance')->nullable();
            $table->bigInteger('employee_attendance_type_id')->unsigned()->nullable();
            $table->foreign('employee_attendance_type_id','ea_employee_attendance_type_id_foreign')->references('id')->on('employee_attendance_types')->onDelete('cascade');
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
        Schema::table('employee_attendances', function(Blueprint $table)
        {
            $table->dropForeign('ea_employee_id_foreign');
            $table->dropForeign('ea_employee_attendance_type_id_foreign');
        });

        Schema::dropIfExists('employee_attendances');
    }
}
