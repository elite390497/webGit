<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateExamObservationDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('exam_observation_details', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('exam_observation_id')->unsigned()->nullable();
            $table->foreign('exam_observation_id','eod_exam_observation_id_foreign')->references('id')->on('exam_observations')->onDelete('cascade');
            $table->string('name')->nullable();
            $table->integer('position')->default(0);
            $table->decimal('max_mark',25,5)->default(0);
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
        Schema::table('exam_observation_details', function(Blueprint $table)
        {
            $table->dropForeign('eod_exam_observation_id_foreign');
        });

        Schema::dropIfExists('exam_observation_details');
    }
}
