<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTransferCertificatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transfer_certificates', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('uuid')->nullable();
            $table->string('prefix',20)->nullable();
            $table->integer('number')->default(0);
            $table->bigInteger('student_record_id')->unsigned()->nullable();
            $table->foreign('student_record_id')->references('id')->on('student_records')->onDelete('cascade');
            $table->date('date_of_application')->nullable();
            $table->date('date_of_issue')->nullable();
            $table->string('format')->nullable();
            $table->text('memo')->nullable();
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
        Schema::table('transfer_certificates', function(Blueprint $table)
        {
            $table->dropForeign('transfer_certificates_student_record_id_foreign');
        });
        
        Schema::dropIfExists('transfer_certificates');
    }
}
