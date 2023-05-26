<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStudentRecordsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('student_records', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('academic_session_id')->unsigned()->nullable();
            $table->foreign('academic_session_id')->references('id')->on('academic_sessions')->onDelete('cascade');
            $table->bigInteger('admission_id')->unsigned()->nullable();
            $table->foreign('admission_id')->references('id')->on('admissions')->onDelete('cascade');
            $table->bigInteger('student_id')->unsigned()->nullable();
            $table->foreign('student_id')->references('id')->on('students')->onDelete('cascade');
            $table->boolean('is_promoted')->default(0);
            $table->bigInteger('fee_allocation_id')->unsigned()->nullable();
            $table->foreign('fee_allocation_id')->references('id')->on('fee_allocations')->onDelete('cascade');
            $table->bigInteger('batch_id')->unsigned()->nullable();
            $table->foreign('batch_id')->references('id')->on('batches')->onDelete('cascade');
            $table->string('roll_number',20)->nullable();
            $table->date('date_of_entry')->nullable();
            $table->text('entry_remarks')->nullable();
            $table->date('date_of_exit')->nullable();
            $table->text('exit_remarks')->nullable();
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
        Schema::table('student_records', function(Blueprint $table)
        {
            $table->dropForeign('student_records_academic_session_id_foreign');
            $table->dropForeign('student_records_admission_id_foreign');
            $table->dropForeign('student_records_student_id_foreign');
            $table->dropForeign('student_records_fee_allocation_id_foreign');
            $table->dropForeign('student_records_batch_id_foreign');
        });

        Schema::dropIfExists('student_records');
    }
}
