<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEmployeeSalariesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('employee_salaries', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('uuid')->nullable();
            $table->bigInteger('employee_id')->unsigned()->nullable();
            $table->foreign('employee_id','es_employee_id_foreign')->references('id')->on('employees')->onDelete('cascade');
            $table->bigInteger('payroll_template_id')->unsigned()->nullable();
            $table->foreign('payroll_template_id','es_payroll_template_id_foreign')->references('id')->on('payroll_templates')->onDelete('cascade');
            $table->date('date_effective')->nullable();
            $table->decimal('net_salary',25,5)->default(0);
            $table->text('description')->nullable();
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
        Schema::table('employee_salaries', function(Blueprint $table)
        {
            $table->dropForeign('es_employee_id_foreign');
            $table->dropForeign('es_payroll_template_id_foreign');
        });
        
        Schema::dropIfExists('employee_salaries');
    }
}
