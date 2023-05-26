<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateExamGradeDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('exam_grade_details', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('exam_grade_id')->unsigned()->nullable();
            $table->foreign('exam_grade_id','egd_exam_grade_id_foreign')->references('id')->on('exam_grades')->onDelete('cascade');
            $table->decimal('min_percentage',25,5)->default(0);
            $table->decimal('max_percentage',25,5)->default(0);
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
        Schema::table('exam_grade_details', function(Blueprint $table)
        {
            $table->dropForeign('egd_exam_grade_id_foreign');
        });
        Schema::dropIfExists('exam_grade_details');
    }
}
