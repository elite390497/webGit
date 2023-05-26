<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCommunicationStudentRecordTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('communication_student_record', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('communication_id')->unsigned()->nullable();
            $table->foreign('communication_id', 'csr_communication_id')->references('id')->on('communications')->onDelete('cascade');
            $table->bigInteger('student_record_id')->unsigned()->nullable();
            $table->foreign('student_record_id', 'csr_student_record_id')->references('id')->on('student_records')->onDelete('cascade');
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
        Schema::table('communication_student_record', function(Blueprint $table)
        {
            $table->dropForeign('csr_communication_id');
            $table->dropForeign('csr_student_record_id');
        });

        Schema::dropIfExists('communication_student_record');
    }
}
