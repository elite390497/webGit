<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMeetingEmployeeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('meeting_employee', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('meeting_id')->unsigned()->nullable();
            $table->foreign('meeting_id', 'me_meeting_id')->references('id')->on('meetings')->onDelete('cascade');
            $table->bigInteger('employee_id')->unsigned()->nullable();
            $table->foreign('employee_id', 'me_employee_id')->references('id')->on('employees')->onDelete('cascade');
            $table->boolean('is_attendee')->default(0);
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
        Schema::table('meeting_employee', function(Blueprint $table)
        {
            $table->dropForeign('me_meeting_id');
            $table->dropForeign('me_employee_id');
        });
        
        Schema::dropIfExists('meeting_employee');
    }
}
