<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStudentFeeRecordsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('student_fee_records', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('student_record_id')->unsigned()->nullable();
            $table->foreign('student_record_id')->references('id')->on('student_records')->onDelete('cascade');
            $table->bigInteger('fee_installment_id')->unsigned()->nullable();
            $table->foreign('fee_installment_id')->references('id')->on('fee_installments')->onDelete('cascade');
            $table->bigInteger('transport_circle_id')->unsigned()->nullable();
            $table->foreign('transport_circle_id')->references('id')->on('transport_circles')->onDelete('set null');
            $table->integer('transport_fee')->default(0);
            $table->bigInteger('fee_concession_id')->unsigned()->nullable();
            $table->foreign('fee_concession_id')->references('id')->on('fee_concessions')->onDelete('set null');
            $table->string('status',20)->nullable();
            $table->date('due_date')->nullable();
            $table->string('late_fee_frequency',20)->nullable();
            $table->integer('late_fee')->default(0);
            $table->integer('late_fee_charged')->default(0);
            $table->text('remarks')->nullable();
            $table->uuid('upload_token')->nullable();
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
        Schema::table('student_fee_records', function(Blueprint $table)
        {
            $table->dropForeign('student_fee_records_student_record_id_foreign');
            $table->dropForeign('student_fee_records_fee_installment_id_foreign');
            $table->dropForeign('student_fee_records_transport_circle_id_foreign');
            $table->dropForeign('student_fee_records_fee_concession_id_foreign');
        });
        
        Schema::dropIfExists('student_fee_records');
    }
}
