<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateExamAssessmentDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('exam_assessment_details', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('exam_assessment_id')->unsigned()->nullable();
            $table->foreign('exam_assessment_id','ead_exam_assessment_id_foreign')->references('id')->on('exam_assessments')->onDelete('cascade');
            $table->string('name')->nullable();
            $table->string('code')->nullable();
            $table->integer('position')->default(0);
            $table->decimal('max_mark',25,5)->default(0);
            $table->decimal('pass_percentage',25,5)->default(0);
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
        Schema::table('exam_assessment_details', function(Blueprint $table)
        {
            $table->dropForeign('ead_exam_assessment_id_foreign');
        });
        
        Schema::dropIfExists('exam_assessment_details');
    }
}
