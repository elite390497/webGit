<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateExamSchedulesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('exam_schedules', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('exam_id')->unsigned()->nullable();
            $table->foreign('exam_id','es_exam_id_foreign')->references('id')->on('exams')->onDelete('cascade');
            $table->bigInteger('batch_id')->unsigned()->nullable();
            $table->foreign('batch_id','es_batch_id_foreign')->references('id')->on('batches')->onDelete('cascade');
            $table->bigInteger('exam_grade_id')->unsigned()->nullable();
            $table->foreign('exam_grade_id','es_exam_grade_id_foreign')->references('id')->on('exam_grades')->onDelete('set null');
            $table->bigInteger('exam_assessment_id')->unsigned()->nullable();
            $table->foreign('exam_assessment_id','es_exam_assessment_id_foreign')->references('id')->on('exam_assessments')->onDelete('cascade');
            $table->longText('observation_marks')->nullable();
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
        Schema::table('exam_schedules', function(Blueprint $table)
        {
            $table->dropForeign('es_exam_id_foreign');
            $table->dropForeign('es_batch_id_foreign');
            $table->dropForeign('es_exam_grade_id_foreign');
            $table->dropForeign('es_exam_assessment_id_foreign');
        });

        Schema::dropIfExists('exam_schedules');
    }
}
