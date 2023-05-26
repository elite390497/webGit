<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFeeInstallmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fee_installments', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('uuid');
            $table->bigInteger('fee_allocation_group_id')->unsigned()->nullable();
            $table->foreign('fee_allocation_group_id')->references('id')->on('fee_allocation_groups')->onDelete('cascade');
            $table->bigInteger('transport_fee_id')->unsigned()->nullable();
            $table->foreign('transport_fee_id')->references('id')->on('transport_fees')->onDelete('cascade');
            $table->string('title')->nullable();
            $table->date('due_date')->nullable();
            $table->boolean('late_fee_applicable')->default(0);
            $table->string('late_fee_frequency',20)->nullable();
            $table->integer('late_fee')->default(0);
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
        Schema::table('fee_installments', function(Blueprint $table)
        {
            $table->dropForeign('fee_installments_fee_allocation_group_id_foreign');
            $table->dropForeign('fee_installments_transport_fee_id_foreign');
        });
        
        Schema::dropIfExists('fee_installments');
    }
}
