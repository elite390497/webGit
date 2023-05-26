<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateExamRecordsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('exam_records', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('uuid')->nullable();
            $table->bigInteger('exam_schedule_id')->unsigned()->nullable();
            $table->foreign('exam_schedule_id','er_exam_schedule_id_foreign')->references('id')->on('exam_schedules')->onDelete('cascade');
            $table->bigInteger('subject_id')->unsigned()->nullable();
            $table->foreign('subject_id','er_subject_id_foreign')->references('id')->on('subjects')->onDelete('cascade');
            $table->date('date')->nullable();
            $table->time('start')->nullable();
            $table->time('time')->nullable();
            $table->longText('marks')->nullable();
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
        Schema::table('exam_records', function(Blueprint $table)
        {
            $table->dropForeign('er_exam_schedule_id_foreign');
            $table->dropForeign('er_subject_id_foreign');
        });

        Schema::dropIfExists('exam_records');
    }
}
