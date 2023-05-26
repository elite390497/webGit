<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRegistrationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('registrations', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('student_id')->unsigned()->nullable();
            $table->foreign('student_id')->references('id')->on('students')->onDelete('cascade');
            $table->bigInteger('course_id')->unsigned()->nullable();
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
            $table->date('date_of_registration')->nullable();
            $table->text('registration_remarks')->nullable();
            $table->integer('registration_fee')->default(0);
            $table->string('registration_fee_status',10)->nullable();
            $table->string('status')->nullable();   // pending/allotted/cancelled
            $table->text('rejection_remarks')->nullable();
            $table->bigInteger('previous_institute_id')->unsigned()->nullable();
            $table->foreign('previous_institute_id')->references('id')->on('institutes')->onDelete('set null');
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
        Schema::table('registrations', function(Blueprint $table)
        {
            $table->dropForeign('registrations_student_id_foreign');
            $table->dropForeign('registrations_course_id_foreign');
            $table->dropForeign('registrations_previous_institute_id_foreign');
        });

        Schema::dropIfExists('registrations');
    }
}
