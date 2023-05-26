<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLessonPlanDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('lesson_plan_details', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('lesson_plan_id')->unsigned()->nullable();
            $table->foreign('lesson_plan_id')->references('id')->on('lesson_plans')->onDelete('cascade');
            $table->string('title')->nullable();
            $table->text('description')->nullable();
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
        Schema::table('lesson_plan_details', function(Blueprint $table)
        {
            $table->dropForeign('lesson_plan_details_lesson_plan_id_foreign');
        });
        
        Schema::dropIfExists('lesson_plan_details');
    }
}
