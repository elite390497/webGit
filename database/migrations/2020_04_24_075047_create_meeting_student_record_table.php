<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMeetingStudentRecordTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('meeting_student_record', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('meeting_id')->unsigned()->nullable();
            $table->foreign('meeting_id', 'msr_meeting_id')->references('id')->on('meetings')->onDelete('cascade');
            $table->bigInteger('student_record_id')->unsigned()->nullable();
            $table->foreign('student_record_id', 'msr_student_record_id')->references('id')->on('student_records')->onDelete('cascade');
            $table->boolean('is_attendee')->default(0);
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
        Schema::table('meeting_student_record', function(Blueprint $table)
        {
            $table->dropForeign('msr_meeting_id');
            $table->dropForeign('msr_student_record_id');
        });

        Schema::dropIfExists('meeting_student_record');
    }
}
