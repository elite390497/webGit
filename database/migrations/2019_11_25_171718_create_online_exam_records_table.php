<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOnlineExamRecordsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('online_exam_records', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('online_exam_id')->unsigned()->nullable();
            $table->foreign('online_exam_id','oer_online_exam_id_foreign')->references('id')->on('online_exams')->onDelete('cascade');
            $table->bigInteger('student_record_id')->unsigned()->nullable();
            $table->foreign('student_record_id','oer_student_record_id_foreign')->references('id')->on('student_records')->onDelete('cascade');
            $table->datetime('start')->nullable();
            $table->datetime('end')->nullable();
            $table->longText('answers')->nullable();
            $table->decimal('obtained_mark',25,5)->default(0);
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
        Schema::table('online_exam_records', function(Blueprint $table)
        {
            $table->dropForeign('oer_online_exam_id_foreign');
            $table->dropForeign('oer_student_record_id_foreign');
        });

        Schema::dropIfExists('online_exam_records');
    }
}
