<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFeeInstallmentDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fee_installment_details', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('fee_installment_id')->unsigned()->nullable();
            $table->foreign('fee_installment_id')->references('id')->on('fee_installments')->onDelete('cascade');
            $table->bigInteger('fee_head_id')->unsigned()->nullable();
            $table->foreign('fee_head_id')->references('id')->on('fee_heads')->onDelete('cascade');
            $table->boolean('is_optional')->default(0);
            $table->integer('amount')->default(0);
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
        Schema::table('fee_installment_details', function(Blueprint $table)
        {
            $table->dropForeign('fee_installment_details_fee_installment_id_foreign');
            $table->dropForeign('fee_installment_details_fee_head_id_foreign');
        });

        Schema::dropIfExists('fee_installment_details');
    }
}
