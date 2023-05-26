<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStockPurchaseDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('stock_purchase_details', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('stock_purchase_id')->unsigned()->nullable();
            $table->foreign('stock_purchase_id')->references('id')->on('stock_purchases')->onDelete('cascade');
            $table->bigInteger('stock_item_id')->unsigned()->nullable();
            $table->foreign('stock_item_id')->references('id')->on('stock_items')->onDelete('cascade');
            $table->decimal('quantity',25,5)->default(0);
            $table->decimal('unit_price',25,5)->default(0);
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
        Schema::table('stock_purchase_details', function(Blueprint $table)
        {
            $table->dropForeign('stock_purchase_details_stock_purchase_id_foreign');
            $table->dropForeign('stock_purchase_details_stock_item_id_foreign');
        });

        Schema::dropIfExists('stock_purchase_details');
    }
}
