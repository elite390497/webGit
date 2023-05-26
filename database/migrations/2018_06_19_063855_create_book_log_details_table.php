<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBookLogDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('book_log_details', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('book_log_id')->unsigned()->nullable();
            $table->foreign('book_log_id')->references('id')->on('book_logs')->onDelete('cascade');
            $table->bigInteger('book_post_detail_id')->unsigned()->nullable();
            $table->foreign('book_post_detail_id')->references('id')->on('book_post_details')->onDelete('cascade');
            $table->date('date_of_return')->nullable();
            $table->text('return_remarks')->nullable();
            $table->boolean('is_non_returnable')->default(0);
            $table->text('non_returnable_charge')->nullable();
            $table->text('non_returnable_remarks')->nullable();
            $table->dateTime('non_returnable_at')->nullable();
            $table->integer('late_fee')->default(0);
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
        Schema::table('book_log_details', function(Blueprint $table)
        {
            $table->dropForeign('book_log_details_book_log_id_foreign');
            $table->dropForeign('book_log_details_book_post_detail_id_foreign');
        });

        Schema::dropIfExists('book_log_details');
    }
}
