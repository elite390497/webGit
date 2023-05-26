<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEventEmployeeCategoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('event_employee_category', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('event_id')->unsigned()->nullable();
            $table->foreign('event_id')->references('id')->on('events')->onDelete('cascade');
            $table->bigInteger('employee_category_id')->unsigned()->nullable();
            $table->foreign('employee_category_id')->references('id')->on('employee_categories')->onDelete('cascade');
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
        Schema::table('event_employee_category', function(Blueprint $table)
        {
            $table->dropForeign('event_employee_category_event_id_foreign');
            $table->dropForeign('event_employee_category_employee_category_id_foreign');
        });
        
        Schema::dropIfExists('event_employee_category');
    }
}
