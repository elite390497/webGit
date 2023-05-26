<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStudentFeeRecordDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('student_fee_record_details', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('student_fee_record_id')->unsigned()->nullable();
            $table->foreign('student_fee_record_id')->references('id')->on('student_fee_records')->onDelete('cascade');
            $table->bigInteger('fee_head_id')->unsigned()->nullable();
            $table->foreign('fee_head_id')->references('id')->on('fee_heads')->onDelete('cascade');
            $table->integer('amount')->default(0);
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
        Schema::table('student_fee_record_details', function(Blueprint $table)
        {
            $table->dropForeign('student_fee_record_details_student_fee_record_id_foreign');
            $table->dropForeign('student_fee_record_details_fee_head_id_foreign');
        });

        Schema::dropIfExists('student_fee_record_details');
    }
}
