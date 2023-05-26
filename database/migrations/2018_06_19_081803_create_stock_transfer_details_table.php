<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStockTransferDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('stock_transfer_details', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('stock_transfer_id')->unsigned()->nullable();
            $table->foreign('stock_transfer_id')->references('id')->on('stock_transfers')->onDelete('cascade');
            $table->bigInteger('stock_item_id')->unsigned()->nullable();
            $table->foreign('stock_item_id')->references('id')->on('stock_items')->onDelete('cascade');
            $table->string('custom_item_name')->nullable();
            $table->boolean('is_consumable')->default(0);
            $table->decimal('quantity',25,5)->default(0);
            $table->decimal('return_quantity',25,5)->default(0);
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
        Schema::table('stock_transfer_details', function(Blueprint $table)
        {
            $table->dropForeign('stock_transfer_details_stock_transfer_id_foreign');
            $table->dropForeign('stock_transfer_details_stock_item_id_foreign');
        });
        
        Schema::dropIfExists('stock_transfer_details');
    }
}
