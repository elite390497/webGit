<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMeetingBatchTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('meeting_batch', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('meeting_id')->unsigned()->nullable();
            $table->foreign('meeting_id')->references('id')->on('meetings')->onDelete('cascade');
            $table->bigInteger('batch_id')->unsigned()->nullable();
            $table->foreign('batch_id')->references('id')->on('batches')->onDelete('cascade');
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
        Schema::table('meeting_batch', function(Blueprint $table)
        {
            $table->dropForeign('meeting_batch_meeting_id_foreign');
            $table->dropForeign('meeting_batch_batch_id_foreign');
        });

        Schema::dropIfExists('meeting_batch');
    }
}
