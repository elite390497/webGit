<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBookLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('book_logs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('uuid')->nullable();
            $table->bigInteger('student_record_id')->unsigned()->nullable();
            $table->foreign('student_record_id')->references('id')->on('student_records')->onDelete('cascade');
            $table->bigInteger('employee_id')->unsigned()->nullable();
            $table->foreign('employee_id')->references('id')->on('employees')->onDelete('cascade');
            $table->date('date_of_issue')->nullable();
            $table->text('issue_remarks')->nullable();
            $table->date('due_date')->nullable();
            $table->boolean('late_fee_applicable')->default(0);
            $table->string('late_fee_frequency',20)->nullable();
            $table->integer('late_fee_charge')->default(0);
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
        Schema::table('book_logs', function(Blueprint $table)
        {
            $table->dropForeign('book_logs_student_record_id_foreign');
            $table->dropForeign('book_logs_employee_id_foreign');
        });
        
        Schema::dropIfExists('book_logs');
    }
}
