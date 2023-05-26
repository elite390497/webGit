<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateExamTermsWithCourseGroupColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('exam_terms', function ($table) {
            $table->bigInteger('course_group_id')->unsigned()->nullable()->after('name');
            $table->foreign('course_group_id')->references('id')->on('course_groups')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('exam_terms', function ($table) {
            $table->dropForeign('exam_terms_course_group_id_foreign');
            $table->dropColumn('course_group_id');
        });
    }
}
