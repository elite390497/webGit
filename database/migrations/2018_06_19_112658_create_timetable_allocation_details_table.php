<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTimetableAllocationDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('timetable_allocation_details', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('timetable_allocation_id')->unsigned()->nullable();
            $table->foreign('timetable_allocation_id')->references('id')->on('timetable_allocations')->onDelete('cascade');
            $table->bigInteger('class_timing_session_id')->unsigned()->nullable();
            $table->foreign('class_timing_session_id')->references('id')->on('class_timing_sessions')->onDelete('cascade');
            $table->bigInteger('subject_id')->unsigned()->nullable();
            $table->foreign('subject_id')->references('id')->on('subjects')->onDelete('set null');
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
        Schema::table('timetable_allocation_details', function(Blueprint $table)
        {
            $table->dropForeign('timetable_allocation_details_timetable_allocation_id_foreign');
            $table->dropForeign('timetable_allocation_details_class_timing_session_id_foreign');
            $table->dropForeign('timetable_allocation_details_subject_id_foreign');
        });
        
        Schema::dropIfExists('timetable_allocation_details');
    }
}
