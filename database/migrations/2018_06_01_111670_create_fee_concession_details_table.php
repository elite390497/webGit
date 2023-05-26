<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFeeConcessionDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fee_concession_details', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('fee_concession_id')->unsigned()->nullable();
            $table->foreign('fee_concession_id')->references('id')->on('fee_concessions')->onDelete('cascade');
            $table->bigInteger('fee_head_id')->unsigned()->nullable();
            $table->foreign('fee_head_id')->references('id')->on('fee_heads')->onDelete('cascade');
            $table->integer('amount')->default(0);
            $table->string('type',20)->nullable();
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
        Schema::table('fee_concession_details', function(Blueprint $table)
        {
            $table->dropForeign('fee_concession_details_fee_concession_id_foreign');
            $table->dropForeign('fee_concession_details_fee_head_id_foreign');
        });

        Schema::dropIfExists('fee_concession_details');
    }
}
