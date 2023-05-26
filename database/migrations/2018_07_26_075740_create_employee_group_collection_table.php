<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEmployeeGroupCollectionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('employee_group_collection', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('employee_id')->unsigned()->nullable();
            $table->foreign('employee_id')->references('id')->on('employees')->onDelete('cascade');
            $table->bigInteger('employee_group_id')->unsigned()->nullable();
            $table->foreign('employee_group_id')->references('id')->on('employee_groups')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('employee_group_collection', function(Blueprint $table)
        {
            $table->dropForeign('employee_group_collection_employee_id_foreign');
            $table->dropForeign('employee_group_collection_employee_group_id_foreign');
        });

        Schema::dropIfExists('employee_group_collection');
    }
}
