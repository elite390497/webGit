<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateStockItemsTableWithQuantityColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('stock_items', function (Blueprint $table) {
            $table->integer('opening_quantity')->default(0)->after('code');
            $table->integer('quantity')->default(0)->after('opening_quantity');
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
            $table->dropColumn('opening_quantity');
            $table->dropColumn('quantity');
        });
    }
}
