<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEnquiryDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('enquiry_details', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('uuid')->nullable();
            $table->bigInteger('enquiry_id')->unsigned()->nullable();
            $table->foreign('enquiry_id')->references('id')->on('enquiries')->onDelete('cascade');
            $table->string('student_name')->nullable();
            $table->string('gender',20)->nullable();
            $table->date('date_of_birth')->nullable();
            $table->bigInteger('course_id')->unsigned()->nullable();
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('set null');
            $table->bigInteger('institute_id')->unsigned()->nullable();
            $table->foreign('institute_id')->references('id')->on('institutes')->onDelete('set null');
            $table->boolean('is_admitted')->default(0);
            $table->text('remarks')->nullable();
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
        Schema::table('enquiry_details', function(Blueprint $table)
        {
            $table->dropForeign('enquiry_details_enquiry_id_foreign');
            $table->dropForeign('enquiry_details_course_id_foreign');
            $table->dropForeign('enquiry_details_institute_id_foreign');
        });
        
        Schema::dropIfExists('enquiry_details');
    }
}
