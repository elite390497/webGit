<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateTransactionsTableWithPayrollColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('transactions', function ($table) {
            $table->bigInteger('employee_id')->unsigned()->nullable()->after('student_fee_record_id');
            $table->foreign('employee_id')->references('id')->on('employees')->onDelete('cascade');
            $table->bigInteger('payroll_id')->unsigned()->nullable()->after('employee_id');
            $table->foreign('payroll_id')->references('id')->on('payrolls')->onDelete('cascade');
            $table->boolean('is_advance_salary')->default(0)->after('payroll_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('transactions', function ($table) {
            $table->dropColumn('is_advance_salary');
            $table->dropForeign('transactions_payroll_id_foreign');
            $table->dropColumn('payroll_id');
            $table->dropForeign('transactions_employee_id_foreign');
            $table->dropColumn('employee_id');
        });
    }
}
