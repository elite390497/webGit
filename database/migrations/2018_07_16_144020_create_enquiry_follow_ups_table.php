<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEnquiryFollowUpsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('enquiry_follow_ups', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('enquiry_id')->unsigned()->nullable();
            $table->foreign('enquiry_id')->references('id')->on('enquiries')->onDelete('cascade');
            $table->date('date_of_follow_up')->nullable();
            $table->string('status',20)->nullable();
            $table->date('date_of_next_follow_up')->nullable();
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
        Schema::table('enquiry_follow_ups', function(Blueprint $table)
        {
            $table->dropForeign('enquiry_follow_ups_enquiry_id_foreign');
            $table->dropForeign('enquiry_follow_ups_user_id_foreign');
        });
        
        Schema::dropIfExists('enquiry_follow_ups');
    }
}
