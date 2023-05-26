<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFrontendBlocksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('frontend_blocks', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('uuid')->nullable();
            $table->bigInteger('frontend_menu_id')->unsigned()->nullable();
            $table->foreign('frontend_menu_id')->references('id')->on('frontend_menus')->onDelete('set null');
            $table->integer('position')->default(0);
            $table->string('title')->nullable();
            $table->longText('body')->nullable();
            $table->string('url')->nullable();
            $table->string('featured_image')->nullable();
            $table->string('featured_icon')->nullable();
            $table->boolean('is_draft')->default(0);
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
        Schema::table('frontend_blocks', function(Blueprint $table)
        {
            $table->dropForeign('frontend_blocks_frontend_menu_id_foreign');
        });
        
        Schema::dropIfExists('frontend_blocks');
    }
}
