<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEmployeeSalaryDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('employee_salary_details', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('employee_salary_id')->unsigned()->nullable();
            $table->foreign('employee_salary_id','esd_employee_salary_id_foreign')->references('id')->on('employee_salaries')->onDelete('cascade');
            $table->bigInteger('payroll_template_detail_id')->unsigned()->nullable();
            $table->foreign('payroll_template_detail_id','esd_payroll_template_detail_id_foreign')->references('id')->on('payroll_template_details')->onDelete('cascade');
            $table->decimal('amount',25,5)->default(0);
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
        Schema::table('employee_salary_details', function(Blueprint $table)
        {
            $table->dropForeign('esd_employee_salary_id_foreign');
            $table->dropForeign('esd_payroll_template_detail_id_foreign');
        });
        
        Schema::dropIfExists('employee_salary_details');
    }
}
