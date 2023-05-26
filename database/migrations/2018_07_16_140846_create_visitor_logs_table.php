<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVisitorLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('visitor_logs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('uuid')->nullable();
            $table->bigInteger('visiting_purpose_id')->unsigned()->nullable();
            $table->foreign('visiting_purpose_id')->references('id')->on('visiting_purposes')->onDelete('cascade');
            $table->string('type',20)->nullable();
            $table->string('name')->nullable();
            $table->string('relation_with_student')->nullable();
            $table->string('company_name')->nullable();
            $table->string('contact_number')->nullable();
            $table->text('address')->nullable();
            $table->integer('visitor_count')->nullable();
            $table->date('date_of_visit')->nullable();
            $table->time('entry_time')->nullable();
            $table->time('exit_time')->nullable();
            $table->bigInteger('student_id')->unsigned()->nullable();
            $table->foreign('student_id')->references('id')->on('students')->onDelete('cascade');
            $table->bigInteger('employee_id')->unsigned()->nullable();
            $table->foreign('employee_id')->references('id')->on('employees')->onDelete('cascade');
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
        Schema::table('visitor_logs', function(Blueprint $table)
        {
            $table->dropForeign('visitor_logs_visiting_purpose_id_foreign');
            $table->dropForeign('visitor_logs_student_id_foreign');
            $table->dropForeign('visitor_logs_employee_id_foreign');
        });

        Schema::dropIfExists('visitor_logs');
    }
}
