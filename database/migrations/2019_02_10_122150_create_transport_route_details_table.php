<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTransportRouteDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transport_route_details', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('position')->default(0);
            $table->bigInteger('transport_route_id')->unsigned()->nullable();
            $table->foreign('transport_route_id','tr_transport_route_id_foreign')->references('id')->on('transport_routes')->onDelete('cascade');
            $table->bigInteger('transport_stoppage_id')->unsigned()->nullable();
            $table->foreign('transport_stoppage_id','trd_transport_stoppage_id_foreign')->references('id')->on('transport_stoppages')->onDelete('cascade');
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
        Schema::table('transport_route_details', function(Blueprint $table)
        {
            $table->dropForeign('tr_transport_route_id_foreign');
            $table->dropForeign('trd_transport_stoppage_id_foreign');
        });

        Schema::dropIfExists('transport_route_details');
    }
}
