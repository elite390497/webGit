<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateEmployeeDesignationsTableWithCorrectForeignKey extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('employee_designations', function ($table) {
            $table->dropForeign('employee_designations_department_id_foreign');
            $table->foreign('department_id')->references('id')->on('departments')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('employee_designations', function ($table) {
            $table->dropForeign('employee_designations_department_id_foreign');
            $table->foreign('department_id')->references('id')->on('designations')->onDelete('cascade');
        });
    }
}
