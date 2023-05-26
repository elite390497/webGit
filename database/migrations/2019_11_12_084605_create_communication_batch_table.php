<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCommunicationBatchTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('communication_batch', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('communication_id')->unsigned()->nullable();
            $table->foreign('communication_id')->references('id')->on('communications')->onDelete('cascade');
            $table->bigInteger('batch_id')->unsigned()->nullable();
            $table->foreign('batch_id')->references('id')->on('batches')->onDelete('cascade');
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
        Schema::table('communication_batch', function(Blueprint $table)
        {
            $table->dropForeign('communication_batch_communication_id_foreign');
            $table->dropForeign('communication_batch_batch_id_foreign');
        });

        Schema::dropIfExists('communication_batch');
    }
}
