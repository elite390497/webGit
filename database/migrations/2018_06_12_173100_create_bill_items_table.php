<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBillItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bill_items', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('uuid');
            $table->bigInteger('bill_id')->unsigned()->nullable();
            $table->foreign('bill_id')->references('id')->on('bills')->onDelete('cascade');
            $table->bigInteger('stock_item_id')->unsigned()->nullable();
            $table->foreign('stock_item_id')->references('id')->on('stock_items')->onDelete('cascade');
            $table->string('custom_item_name')->nullable();
            $table->decimal('quantity',25,5)->default(0);
            $table->decimal('unit_price',25,5)->default(0);
            $table->decimal('discount',25,5)->default(0);
            $table->decimal('tax',25,5)->default(0);
            $table->decimal('amount',25,5)->default(0);
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
        Schema::table('bill_items', function(Blueprint $table)
        {
            $table->dropForeign('bill_items_bill_id_foreign');
            $table->dropForeign('bill_items_stock_item_id_foreign');
        });

        Schema::dropIfExists('bill_items');
    }
}
