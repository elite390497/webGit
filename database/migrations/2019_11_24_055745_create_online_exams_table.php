<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOnlineExamsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('online_exams', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('uuid')->nullable();
            $table->string('name')->nullable();
            $table->bigInteger('academic_session_id')->unsigned()->nullable();
            $table->foreign('academic_session_id','oe_academic_session_id_foreign')->references('id')->on('academic_sessions')->onDelete('cascade');
            $table->bigInteger('batch_id')->unsigned()->nullable();
            $table->foreign('batch_id','oe_batch_id_foreign')->references('id')->on('batches')->onDelete('cascade');
            $table->bigInteger('subject_id')->unsigned()->nullable();
            $table->foreign('subject_id','oe_subject_id_foreign')->references('id')->on('subjects')->onDelete('cascade');
            $table->text('instructions')->nullable();
            $table->string('exam_type')->nullable();
            $table->boolean('is_published')->default(0);
            $table->date('date')->nullable();
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->decimal('passing_percentage',25,5)->default(0);
            $table->decimal('max_mark',25,5)->default(0);
            $table->boolean('is_negative_mark_applicable')->default(0);
            $table->decimal('negative_mark_percentage_per_question')->default(0);
            $table->text('description')->nullable();
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
        Schema::table('online_exams', function(Blueprint $table)
        {
            $table->dropForeign('oe_academic_session_id_foreign');
        });

        Schema::dropIfExists('online_exams');
    }
}
