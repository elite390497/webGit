<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateComplaintsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('complaints', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('uuid')->nullable();
            $table->bigInteger('complaint_type_id')->unsigned()->nullable();
            $table->foreign('complaint_type_id')->references('id')->on('complaint_types')->onDelete('cascade');
            $table->string('complainant_name')->nullable();
            $table->string('complainant_contact_number')->nullable();
            $table->string('complainant_address')->nullable();
            $table->text('description')->nullable();
            $table->date('date_of_complaint')->nullable();
            $table->bigInteger('employee_id')->unsigned()->nullable();
            $table->foreign('employee_id')->references('id')->on('employees')->onDelete('cascade');
            $table->text('action')->nullable();
            $table->date('date_of_resolution')->nullable();
            $table->text('remarks')->nullable();
            $table->bigInteger('user_id')->unsigned()->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
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
        Schema::table('complaints', function(Blueprint $table)
        {
            $table->dropForeign('complaints_complaint_type_id_foreign');
            $table->dropForeign('complaints_employee_id_foreign');
            $table->dropForeign('complaints_user_id_foreign');
        });

        Schema::dropIfExists('complaints');
    }
}
