<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCommunicationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('communications', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('uuid')->nullable();
            $table->string('type',50)->nullable();
            $table->string('subject')->nullable();
            $table->text('body')->nullable();
            $table->longText('recipient_numbers')->nullable();
            $table->longText('recipient_emails')->nullable();
            $table->integer('recipient_count')->nullable();
            $table->string('audience',50)->nullable();
            $table->longText('included_numbers')->nullable();
            $table->longText('included_emails')->nullable();
            $table->longText('excluded_numbers')->nullable();
            $table->longText('excluded_emails')->nullable();
            $table->bigInteger('user_id')->unsigned()->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
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
        Schema::table('communications', function(Blueprint $table)
        {
            $table->dropForeign('communications_user_id_foreign');
        });
        
        Schema::dropIfExists('communications');
    }
}
