<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateTransactionsTableWithOnlinePaymentColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('transactions', function ($table) {
            $table->boolean('is_online_payment')->default(0)->after('reference_number');
            $table->decimal('handling_fee',25,5)->default(0)->after('is_online_payment');
            $table->string('source',50)->nullable()->after('is_online_payment');
            $table->string('source_detail',50)->nullable()->after('source');
            $table->string('gateway_token')->nullable()->after('source_detail');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('transactions', function ($table) {
            $table->dropColumn('is_online_payment');
            $table->dropColumn('handling_fee');
            $table->dropColumn('source');
            $table->dropColumn('source_detail');
            $table->dropColumn('gateway_token');
        });
    }
}
