<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTransportFeeDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transport_fee_details', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('transport_fee_id')->unsigned()->nullable();
            $table->foreign('transport_fee_id')->references('id')->on('transport_fees')->onDelete('cascade');
            $table->bigInteger('transport_circle_id')->unsigned()->nullable();
            $table->foreign('transport_circle_id')->references('id')->on('transport_circles')->onDelete('cascade');
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
        Schema::table('transport_fee_details', function(Blueprint $table)
        {
            $table->dropForeign('transport_fee_details_transport_fee_id_foreign');
            $table->dropForeign('transport_fee_details_transport_circle_id_foreign');
        });
        
        Schema::dropIfExists('transport_fee_details');
    }
}
