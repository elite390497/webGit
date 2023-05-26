<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEmployeeDocumentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('employee_documents', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('employee_id')->unsigned()->nullable();
            $table->foreign('employee_id')->references('id')->on('employees')->onDelete('cascade');
            $table->bigInteger('employee_document_type_id')->unsigned()->nullable();
            $table->foreign('employee_document_type_id')->references('id')->on('employee_document_types')->onDelete('cascade');
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
        Schema::table('employee_documents', function(Blueprint $table)
        {
            $table->dropForeign('employee_documents_employee_id_foreign');
            $table->dropForeign('employee_documents_employee_document_type_id_foreign');
        });

        Schema::dropIfExists('employee_documents');
    }
}
