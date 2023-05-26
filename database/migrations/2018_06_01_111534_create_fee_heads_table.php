<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFeeHeadsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fee_heads', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name')->nullable();
            $table->bigInteger('fee_group_id')->unsigned()->nullable();
            $table->foreign('fee_group_id')->references('id')->on('fee_groups')->onDelete('cascade');
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
        Schema::table('fee_heads', function(Blueprint $table)
        {
            $table->dropForeign('fee_heads_fee_group_id_foreign');
        });

        Schema::dropIfExists('fee_heads');
    }
}
