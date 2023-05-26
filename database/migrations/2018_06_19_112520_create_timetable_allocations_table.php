<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTimetableAllocationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('timetable_allocations', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('timetable_id')->unsigned()->nullable();
            $table->foreign('timetable_id')->references('id')->on('timetables')->onDelete('cascade');
            $table->string('day',10)->nullable();
            $table->bigInteger('class_timing_id')->unsigned()->nullable();
            $table->foreign('class_timing_id')->references('id')->on('class_timings')->onDelete('cascade');
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
        Schema::table('timetable_allocations', function(Blueprint $table)
        {
            $table->dropForeign('timetable_allocations_timetable_id_foreign');
            $table->dropForeign('timetable_allocations_class_timing_id_foreign');
        });
        
        Schema::dropIfExists('timetable_allocations');
    }
}
