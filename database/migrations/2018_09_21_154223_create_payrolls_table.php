<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePayrollsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('payrolls', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('uuid')->nullable();
            $table->bigInteger('employee_id')->unsigned()->nullable();
            $table->foreign('employee_id','pr_employee_id_foreign')->references('id')->on('employees')->onDelete('cascade');
            $table->bigInteger('employee_salary_id')->unsigned()->nullable();
            $table->foreign('employee_salary_id','pr_employee_salary_id_foreign')->references('id')->on('employee_salaries')->onDelete('cascade');
            $table->string('period',20)->nullable();
            $table->string('period_detail',20)->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('per_day_calculation_basis',50)->nullable();
            $table->integer('user_defined_days')->default(0);
            $table->decimal('total',25,5)->default(0);
            $table->decimal('paid',25,5)->default(0);
            $table->string('payment_status',20)->nullable();
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
        Schema::table('payrolls', function(Blueprint $table)
        {
            $table->dropForeign('pr_employee_id_foreign');
            $table->dropForeign('pr_employee_salary_id_foreign');
        });
        
        Schema::dropIfExists('payrolls');
    }
}
