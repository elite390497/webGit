<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCertificatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('certificates', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('uuid');
            $table->bigInteger('certificate_template_id')->unsigned()->nullable();
            $table->foreign('certificate_template_id')->references('id')->on('certificate_templates')->onDelete('cascade');
            $table->bigInteger('student_record_id')->unsigned()->nullable();
            $table->foreign('student_record_id')->references('id')->on('student_records')->onDelete('cascade');
            $table->bigInteger('employee_id')->unsigned()->nullable();
            $table->foreign('employee_id')->references('id')->on('employees')->onDelete('cascade');
            $table->date('date_of_certificate')->nullable();
            $table->longText('body')->nullable();
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
        Schema::table('certificates', function(Blueprint $table)
        {
            $table->dropForeign('certificates_certificate_template_id_foreign');
            $table->dropForeign('certificates_student_record_id_foreign');
            $table->dropForeign('certificates_employee_id_foreign');
        });

        Schema::dropIfExists('certificates');
    }
}
