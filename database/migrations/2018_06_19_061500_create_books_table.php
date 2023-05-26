<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBooksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('books', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('uuid')->nullable();
            $table->string('title')->nullable();
            $table->string('isbn_number')->nullable();
            $table->bigInteger('book_author_id')->unsigned()->nullable();
            $table->foreign('book_author_id')->references('id')->on('book_authors')->onDelete('cascade');
            $table->bigInteger('book_publisher_id')->unsigned()->nullable();
            $table->foreign('book_publisher_id')->references('id')->on('book_publishers')->onDelete('cascade');
            $table->bigInteger('book_topic_id')->unsigned()->nullable();
            $table->foreign('book_topic_id')->references('id')->on('book_topics')->onDelete('cascade');
            $table->bigInteger('book_language_id')->unsigned()->nullable();
            $table->foreign('book_language_id')->references('id')->on('book_languages')->onDelete('cascade');
            $table->string('edition')->nullable();
            $table->string('type',20)->nullable();
            $table->integer('page')->default(0);
            $table->integer('price')->default(0);
            $table->text('summary')->nullable();
            $table->text('description')->nullable();
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
        Schema::table('books', function(Blueprint $table)
        {
            $table->dropForeign('books_book_author_id_foreign');
            $table->dropForeign('books_book_publisher_id_foreign');
            $table->dropForeign('books_book_topic_id_foreign');
            $table->dropForeign('books_book_language_id_foreign');
        });
        
        Schema::dropIfExists('books');
    }
}
