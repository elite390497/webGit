<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStudentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('students', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('user_id')->unsigned()->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->bigInteger('student_parent_id')->unsigned()->nullable();
            $table->foreign('student_parent_id')->references('id')->on('student_parents')->onDelete('set null');
            $table->uuid('uuid')->nullable();
            $table->string('first_name')->nullable();
            $table->string('middle_name')->nullable();
            $table->string('last_name')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('birth_place',50)->nullable();
            $table->string('gender',20)->nullable();
            $table->string('contact_number',20)->nullable();
            $table->string('email',50)->nullable();
            $table->string('nationality',20)->nullable();
            $table->bigInteger('blood_group_id')->unsigned()->nullable();
            $table->foreign('blood_group_id')->references('id')->on('blood_groups')->onDelete('set null');
            $table->bigInteger('religion_id')->unsigned()->nullable();
            $table->foreign('religion_id')->references('id')->on('religions')->onDelete('set null');
            $table->bigInteger('category_id')->unsigned()->nullable();
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('set null');
            $table->bigInteger('caste_id')->unsigned()->nullable();
            $table->foreign('caste_id')->references('id')->on('castes')->onDelete('set null');
            $table->string('student_photo')->nullable();
            $table->string('mother_tongue',20)->nullable();
            $table->string('unique_identification_number',20)->nullable();
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_number')->nullable();
            $table->string('present_address_line_1')->nullable();
            $table->string('present_address_line_2')->nullable();
            $table->string('present_city')->nullable();
            $table->string('present_state')->nullable();
            $table->string('present_zipcode')->nullable();
            $table->string('present_country')->nullable();
            $table->boolean('same_as_present_address')->default(0);
            $table->string('permanent_address_line_1')->nullable();
            $table->string('permanent_address_line_2')->nullable();
            $table->string('permanent_city')->nullable();
            $table->string('permanent_state')->nullable();
            $table->string('permanent_zipcode')->nullable();
            $table->string('permanent_country')->nullable();
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
        Schema::table('students', function(Blueprint $table)
        {
            $table->dropForeign('students_user_id_foreign');
            $table->dropForeign('students_student_parent_id_foreign');
            $table->dropForeign('students_blood_group_id_foreign');
            $table->dropForeign('students_religion_id_foreign');
            $table->dropForeign('students_category_id_foreign');
            $table->dropForeign('students_caste_id_foreign');
        });

        Schema::dropIfExists('students');
    }
}
