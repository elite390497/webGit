<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAccountTransfersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('account_transfers', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('uuid')->nullable();
            $table->bigInteger('from_account_id')->unsigned()->nullable();
            $table->foreign('from_account_id')->references('id')->on('accounts')->onDelete('cascade');
            $table->bigInteger('to_account_id')->unsigned()->nullable();
            $table->foreign('to_account_id')->references('id')->on('accounts')->onDelete('cascade');
            $table->bigInteger('user_id')->unsigned()->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->date('date_of_account_transfer')->nullable();
            $table->decimal('amount',25,5)->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_cancelled')->default(0);
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
        Schema::table('account_transfers', function(Blueprint $table)
        {
            $table->dropForeign('account_transfers_from_account_id_foreign');
            $table->dropForeign('account_transfers_to_account_id_foreign');
            $table->dropForeign('account_transfers_user_id_foreign');
        });

        Schema::dropIfExists('account_transfers');
    }
}
