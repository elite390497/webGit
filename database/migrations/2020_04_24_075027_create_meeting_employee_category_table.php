<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMeetingEmployeeCategoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('meeting_employee_category', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('meeting_id')->unsigned()->nullable();
            $table->foreign('meeting_id', 'mec_meeting_id_foreign')->references('id')->on('meetings')->onDelete('cascade');
            $table->bigInteger('employee_category_id')->unsigned()->nullable();
            $table->foreign('employee_category_id', 'mec_employee_category_id_foreign')->references('id')->on('employee_categories')->onDelete('cascade');
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
        Schema::table('meeting_employee_category', function(Blueprint $table)
        {
            $table->dropForeign('mec_meeting_id_foreign');
            $table->dropForeign('mec_employee_category_id_foreign');
        });

        Schema::dropIfExists('meeting_employee_category');
    }
}
