<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStudentSiblingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('student_siblings', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('student_id')->unsigned()->nullable();
            $table->foreign('student_id')->references('id')->on('students')->onDelete('cascade');
            $table->bigInteger('sibling_student_id')->unsigned()->nullable();
            $table->foreign('sibling_student_id')->references('id')->on('students')->onDelete('cascade');
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
        Schema::table('student_siblings', function(Blueprint $table)
        {
            $table->dropForeign('student_siblings_student_id_foreign');
            $table->dropForeign('student_siblings_sibling_student_id_foreign');
        });
        
        Schema::dropIfExists('student_siblings');
    }
}
