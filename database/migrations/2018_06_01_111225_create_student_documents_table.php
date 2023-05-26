<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStudentDocumentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('student_documents', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('student_id')->unsigned()->nullable();
            $table->foreign('student_id')->references('id')->on('students')->onDelete('cascade');
            $table->bigInteger('student_document_type_id')->unsigned()->nullable();
            $table->foreign('student_document_type_id')->references('id')->on('student_document_types')->onDelete('cascade');
            $table->string('title')->nullable();
            $table->text('description')->nullable();
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
        Schema::table('student_documents', function(Blueprint $table)
        {
            $table->dropForeign('student_documents_student_id_foreign');
            $table->dropForeign('student_documents_student_document_type_id_foreign');
        });
        
        Schema::dropIfExists('student_documents');
    }
}
