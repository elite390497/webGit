<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFrontendMenusTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('frontend_menus', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name')->nullable();
            $table->string('slug')->nullable();
            $table->string('type')->nullable();
            $table->integer('position')->default(0);
            $table->bigInteger('parent_id')->unsigned()->nullable();
            $table->foreign('parent_id')->references('id')->on('frontend_menus')->onDelete('set null');
            $table->bigInteger('frontend_page_id')->unsigned()->nullable();
            $table->foreign('frontend_page_id')->references('id')->on('frontend_pages')->onDelete('set null');
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
        Schema::table('frontend_menus', function(Blueprint $table)
        {
            $table->dropForeign('frontend_menus_parent_id_foreign');
            $table->dropForeign('frontend_menus_frontend_page_id_foreign');
        });

        Schema::dropIfExists('frontend_menus');
    }
}
