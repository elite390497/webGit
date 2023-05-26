<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVehicleDocumentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vehicle_documents', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('vehicle_id')->unsigned()->nullable();
            $table->foreign('vehicle_id')->references('id')->on('vehicles')->onDelete('cascade');
            $table->string('title')->nullable();
            $table->bigInteger('vehicle_document_type_id')->unsigned()->nullable();
            $table->foreign('vehicle_document_type_id')->references('id')->on('vehicle_document_types')->onDelete('cascade');
            $table->date('date_of_expiry')->nullable();
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
        Schema::table('vehicle_documents', function(Blueprint $table)
        {
            $table->dropForeign('vehicle_documents_vehicle_id_foreign');
            $table->dropForeign('vehicle_documents_vehicle_document_type_id_foreign');
        });
        
        Schema::dropIfExists('vehicle_documents');
    }
}
