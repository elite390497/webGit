<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCoursesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('position')->default(0);
            $table->bigInteger('academic_session_id')->unsigned()->nullable();
            $table->foreign('academic_session_id')->references('id')->on('academic_sessions')->onDelete('cascade');
            $table->bigInteger('course_group_id')->unsigned()->nullable();
            $table->foreign('course_group_id')->references('id')->on('course_groups')->onDelete('set null');
            $table->string('name')->nullable();
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
        Schema::table('courses', function(Blueprint $table)
        {
            $table->dropForeign('courses_academic_session_id_foreign');
            $table->dropForeign('courses_course_group_id_foreign');
        });

        Schema::dropIfExists('courses');
    }
}
