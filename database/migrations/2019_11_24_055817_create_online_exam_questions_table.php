<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOnlineExamQuestionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('online_exam_questions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('online_exam_id')->unsigned()->nullable();
            $table->foreign('online_exam_id','oeq_online_exam_id_foreign')->references('id')->on('online_exams')->onDelete('cascade');
            $table->integer('position')->default(0);
            $table->text('question')->nullable();
            $table->string('image')->nullable();
            $table->string('question_type')->nullable();
            $table->decimal('mark', 25,5)->default(0);
            $table->longText('answers')->nullable();
            $table->uuid('upload_token')->nullable();
            $table->longText('options')->nullable();
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
        Schema::table('online_exam_questions', function(Blueprint $table)
        {
            $table->dropForeign('oeq_online_exam_id_foreign');
        });

        Schema::dropIfExists('online_exam_questions');
    }
}
