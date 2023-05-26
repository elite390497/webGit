<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFeeAllocationGroupsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fee_allocation_groups', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('fee_allocation_id')->unsigned()->nullable();
            $table->foreign('fee_allocation_id')->references('id')->on('fee_allocations')->onDelete('cascade');
            $table->bigInteger('fee_group_id')->unsigned()->nullable();
            $table->foreign('fee_group_id')->references('id')->on('fee_groups')->onDelete('cascade');
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
        Schema::table('fee_allocation_groups', function(Blueprint $table)
        {
            $table->dropForeign('fee_allocation_groups_fee_allocation_id_foreign');
            $table->dropForeign('fee_allocation_groups_fee_group_id_foreign');
        });
        
        Schema::dropIfExists('fee_allocation_groups');
    }
}
