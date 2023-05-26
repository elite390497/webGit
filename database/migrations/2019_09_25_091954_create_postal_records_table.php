<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePostalRecordsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('postal_records', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('uuid')->nullable();
            $table->string('type', 20)->nullable();
            $table->string('sender_title')->nullable();
            $table->text('sender_address')->nullable();
            $table->string('receiver_title')->nullable();
            $table->text('receiver_address')->nullable();
            $table->string('reference_number')->nullable();
            $table->boolean('is_confidential')->default(0);
            $table->date('date')->nullable();
            $table->text('description')->nullable();
            $table->uuid('upload_token')->nullable();
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
        Schema::table('postal_records', function(Blueprint $table)
        {
            $table->dropForeign('postal_records_user_id_foreign');
        });

        Schema::dropIfExists('postal_records');
    }
}
