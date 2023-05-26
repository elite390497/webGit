<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTransportRoutesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transport_routes', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name')->nullable();
            $table->bigInteger('academic_session_id')->unsigned()->nullable();
            $table->foreign('academic_session_id','tr_academic_session_id_foreign')->references('id')->on('academic_sessions')->onDelete('cascade');
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
        Schema::table('transport_routes', function(Blueprint $table)
        {
            $table->dropForeign('tr_academic_session_id_foreign');
        });

        Schema::dropIfExists('transport_routes');
    }
}
