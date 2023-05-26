<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCallLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('call_logs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('uuid')->nullable();
            $table->bigInteger('calling_purpose_id')->unsigned()->nullable();
            $table->foreign('calling_purpose_id')->references('id')->on('calling_purposes')->onDelete('cascade');
            $table->string('type', 20)->nullable();
            $table->string('name')->nullable();
            $table->string('incoming_number')->nullable();
            $table->string('outgoing_number')->nullable();
            $table->date('date')->nullable();
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->text('description')->nullable();
            $table->bigInteger('user_id')->unsigned()->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->uuid('upload_token')->nullable();
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
        Schema::table('call_logs', function(Blueprint $table)
        {
            $table->dropForeign('call_logs_calling_purpose_id_foreign');
            $table->dropForeign('call_logs_user_id_foreign');
        });

        Schema::dropIfExists('call_logs');
    }
}
