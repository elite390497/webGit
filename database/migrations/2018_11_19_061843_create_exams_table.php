<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateExamsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('exams', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('academic_session_id')->unsigned()->nullable();
            $table->foreign('academic_session_id')->references('id')->on('academic_sessions')->onDelete('cascade');
            $table->bigInteger('exam_term_id')->unsigned()->nullable();
            $table->foreign('exam_term_id')->references('id')->on('exam_terms')->onDelete('set null');
            $table->string('name')->nullable();
            $table->integer('position')->default(0);
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
        Schema::table('exams', function(Blueprint $table)
        {
            $table->dropForeign('exams_academic_session_id_foreign');
            $table->dropForeign('exams_exam_term_id_foreign');
        });
        
        Schema::dropIfExists('exams');
    }
}
