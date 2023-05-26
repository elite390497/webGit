<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePayrollTemplateDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('payroll_template_details', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('payroll_template_id')->unsigned()->nullable();
            $table->foreign('payroll_template_id','ptd_payroll_template_id_foreign')->references('id')->on('payroll_templates')->onDelete('cascade');
            $table->bigInteger('pay_head_id')->unsigned()->nullable();
            $table->foreign('pay_head_id','ptd_pay_head_id_foreign')->references('id')->on('pay_heads')->onDelete('cascade');
            $table->bigInteger('employee_attendance_type_id')->unsigned()->nullable();
            $table->foreign('employee_attendance_type_id','ptd_employee_attendance_type_id_foreign')->references('id')->on('employee_attendance_types')->onDelete('cascade');
            $table->integer('position')->default(0);
            $table->string('category',20)->default(0);
            $table->text('computation')->nullable();
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
        Schema::table('payroll_template_details', function(Blueprint $table)
        {
            $table->dropForeign('ptd_payroll_template_id_foreign');
            $table->dropForeign('ptd_pay_head_id_foreign');
            $table->dropForeign('ptd_employee_attendance_type_id_foreign');
        });

        Schema::dropIfExists('payroll_template_details');
    }
}
