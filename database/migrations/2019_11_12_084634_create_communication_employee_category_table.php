<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCommunicationEmployeeCategoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('communication_employee_category', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('communication_id')->unsigned()->nullable();
            $table->foreign('communication_id')->references('id')->on('communications')->onDelete('cascade');
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
        Schema::table('communication_employee_category', function(Blueprint $table)
        {
            $table->dropForeign('communication_employee_category_communication_id_foreign');
            $table->dropForeign('communication_employee_category_employee_category_id_foreign');
        });

        Schema::dropIfExists('communication_employee_category');
    }
}
