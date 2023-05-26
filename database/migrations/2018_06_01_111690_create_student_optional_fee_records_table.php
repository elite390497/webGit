<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStudentOptionalFeeRecordsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('student_optional_fee_records', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('student_fee_record_id')->unsigned()->nullable();
            $table->foreign('student_fee_record_id')->references('id')->on('student_fee_records')->onDelete('cascade');
            $table->bigInteger('fee_head_id')->unsigned()->nullable();
            $table->foreign('fee_head_id')->references('id')->on('fee_heads')->onDelete('cascade');
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
        Schema::table('student_optional_fee_records', function(Blueprint $table)
        {
            $table->dropForeign('student_optional_fee_records_student_fee_record_id_foreign');
            $table->dropForeign('student_optional_fee_records_fee_head_id_foreign');
        });
        
        Schema::dropIfExists('student_optional_fee_records');
    }
}
