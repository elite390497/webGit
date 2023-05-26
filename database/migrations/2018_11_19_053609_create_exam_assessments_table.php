<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateExamAssessmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('exam_assessments', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('academic_session_id')->unsigned()->nullable();
            $table->foreign('academic_session_id','ea_academic_session_id_foreign')->references('id')->on('academic_sessions')->onDelete('cascade');
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
        Schema::table('exam_assessments', function(Blueprint $table)
        {
            $table->dropForeign('ea_academic_session_id_foreign');
        });

        Schema::dropIfExists('exam_assessments');
    }
}
