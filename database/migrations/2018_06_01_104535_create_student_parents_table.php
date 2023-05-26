<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStudentParentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('student_parents', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('user_id')->unsigned()->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->string('first_guardian_name')->nullable();
            $table->string('first_guardian_relation')->nullable();
            $table->date('first_guardian_date_of_birth')->nullable();
            $table->string('first_guardian_qualification')->nullable();
            $table->string('first_guardian_occupation')->nullable();
            $table->string('first_guardian_annual_income')->nullable();
            $table->string('first_guardian_email')->nullable();
            $table->string('first_guardian_contact_number_1')->nullable();
            $table->string('first_guardian_contact_number_2')->nullable();
            $table->string('first_guardian_photo')->nullable();
            $table->string('first_guardian_unique_identification_number',20)->nullable();
            $table->string('second_guardian_name')->nullable();
            $table->string('second_guardian_relation')->nullable();
            $table->date('second_guardian_date_of_birth')->nullable();
            $table->string('second_guardian_qualification')->nullable();
            $table->string('second_guardian_occupation')->nullable();
            $table->string('second_guardian_annual_income')->nullable();
            $table->string('second_guardian_email')->nullable();
            $table->string('second_guardian_contact_number_1')->nullable();
            $table->string('second_guardian_contact_number_2')->nullable();
            $table->string('second_guardian_photo')->nullable();
            $table->string('second_guardian_unique_identification_number',20)->nullable();
            $table->string('third_guardian_name')->nullable();
            $table->string('third_guardian_relation')->nullable();
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
        Schema::table('student_parents', function(Blueprint $table)
        {
            $table->dropForeign('student_parents_user_id_foreign');
        });

        Schema::dropIfExists('student_parents');
    }
}
