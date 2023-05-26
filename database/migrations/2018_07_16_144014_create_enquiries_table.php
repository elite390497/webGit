<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEnquiriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('enquiries', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('uuid')->nullable();
            $table->string('first_guardian_name')->nullable();
            $table->string('first_guardian_relation')->nullable();
            $table->string('second_guardian_name')->nullable();
            $table->string('second_guardian_relation')->nullable();
            $table->string('third_guardian_name')->nullable();
            $table->string('third_guardian_relation')->nullable();
            $table->string('email')->nullable();
            $table->string('contact_number',20)->nullable();
            $table->string('alternate_contact_number',20)->nullable();
            $table->date('date_of_enquiry')->nullable();
            $table->string('status',20)->nullable();
            $table->bigInteger('enquiry_type_id')->unsigned()->nullable();
            $table->foreign('enquiry_type_id')->references('id')->on('enquiry_types')->onDelete('cascade');
            $table->bigInteger('enquiry_source_id')->unsigned()->nullable();
            $table->foreign('enquiry_source_id')->references('id')->on('enquiry_sources')->onDelete('cascade');
            $table->bigInteger('user_id')->unsigned()->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
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
        Schema::table('enquiries', function(Blueprint $table)
        {
            $table->dropForeign('enquiries_enquiry_type_id_foreign');
            $table->dropForeign('enquiries_enquiry_source_id_foreign');
            $table->dropForeign('enquiries_user_id_foreign');
        });

        Schema::dropIfExists('enquiries');
    }
}
