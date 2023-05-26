<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateClassTimingSessionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('class_timing_sessions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('uuid')->nullable();
            $table->bigInteger('class_timing_id')->unsigned()->nullable();
            $table->foreign('class_timing_id')->references('id')->on('class_timings')->onDelete('cascade');
            $table->string('name')->nullable();
            $table->time('start')->nullable();
            $table->time('end')->nullable();
            $table->boolean('is_a_break')->default(0);
            $table->text('description')->nullable();
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
        Schema::table('class_timing_sessions', function(Blueprint $table)
        {
            $table->dropForeign('class_timing_sessions_class_timing_id_foreign');
        });

        Schema::dropIfExists('class_timing_sessions');
    }
}
