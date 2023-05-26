<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCommunicationCourseTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('communication_course', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('communication_id')->unsigned()->nullable();
            $table->foreign('communication_id')->references('id')->on('communications')->onDelete('cascade');
            $table->bigInteger('course_id')->unsigned()->nullable();
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
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
        Schema::table('communication_course', function(Blueprint $table)
        {
            $table->dropForeign('communication_course_communication_id_foreign');
            $table->dropForeign('communication_course_course_id_foreign');
        });

        Schema::dropIfExists('communication_course');
    }
}
