<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCommunicationDepartmentTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('communication_department', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('communication_id')->unsigned()->nullable();
            $table->foreign('communication_id')->references('id')->on('communications')->onDelete('cascade');
            $table->bigInteger('department_id')->unsigned()->nullable();
            $table->foreign('department_id')->references('id')->on('departments')->onDelete('cascade');
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
        Schema::table('communication_department', function(Blueprint $table)
        {
            $table->dropForeign('communication_department_communication_id_foreign');
            $table->dropForeign('communication_department_department_id_foreign');
        });

        Schema::dropIfExists('communication_department');
    }
}
