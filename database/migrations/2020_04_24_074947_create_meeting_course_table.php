<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMeetingCourseTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('meeting_course', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('meeting_id')->unsigned()->nullable();
            $table->foreign('meeting_id')->references('id')->on('meetings')->onDelete('cascade');
            $table->bigInteger('course_id')->unsigned()->nullable();
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
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
        Schema::table('meeting_course', function(Blueprint $table)
        {
            $table->dropForeign('meeting_course_meeting_id_foreign');
            $table->dropForeign('meeting_course_course_id_foreign');
        });

        Schema::dropIfExists('meeting_course');
    }
}
