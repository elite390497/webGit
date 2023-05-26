<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBookPostDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('book_post_details', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('book_post_id')->unsigned()->nullable();
            $table->foreign('book_post_id')->references('id')->on('book_posts')->onDelete('cascade');
            $table->bigInteger('number')->nullable();
            $table->string('location')->nullable();
            $table->boolean('is_not_available')->default(0);
            $table->bigInteger('book_condition_id')->unsigned()->nullable();
            $table->foreign('book_condition_id')->references('id')->on('book_conditions')->onDelete('cascade');
            $table->text('remarks')->nullable();
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
        Schema::table('book_post_details', function(Blueprint $table)
        {
            $table->dropForeign('book_post_details_book_post_id_foreign');
            $table->dropForeign('book_post_details_book_condition_id_foreign');
        });

        Schema::dropIfExists('book_post_details');
    }
}
