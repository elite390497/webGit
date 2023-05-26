<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStockItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('stock_items', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name')->nullable();
            $table->string('code')->nullable();
            $table->bigInteger('stock_category_id')->unsigned()->nullable();
            $table->foreign('stock_category_id')->references('id')->on('stock_categories')->onDelete('cascade');
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
        Schema::table('stock_items', function(Blueprint $table)
        {
            $table->dropForeign('stock_items_stock_category_id_foreign');
        });
        
        Schema::dropIfExists('stock_items');
    }
}
