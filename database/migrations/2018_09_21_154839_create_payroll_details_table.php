<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePayrollDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('payroll_details', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('payroll_id')->unsigned()->nullable();
            $table->foreign('payroll_id','pd_payroll_id_foreign')->references('id')->on('payrolls')->onDelete('cascade');
            $table->bigInteger('pay_head_id')->unsigned()->nullable();
            $table->foreign('pay_head_id','pd_pay_head_id_foreign')->references('id')->on('pay_heads')->onDelete('cascade');
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
        Schema::table('payroll_details', function(Blueprint $table)
        {
            $table->dropForeign('pd_payroll_id_foreign');
            $table->dropForeign('pd_pay_head_id_foreign');
        });
        
        Schema::dropIfExists('payroll_details');
    }
}
