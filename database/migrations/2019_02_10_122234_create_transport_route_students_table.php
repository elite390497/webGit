<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTransportRouteStudentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transport_route_students', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('transport_route_detail_id')->unsigned()->nullable();
            $table->foreign('transport_route_detail_id','trs_transport_route_detail_id_foreign')->references('id')->on('transport_route_details')->onDelete('cascade');
            $table->bigInteger('student_record_id')->unsigned()->nullable();
            $table->foreign('student_record_id','trs_student_record_id_foreign')->references('id')->on('student_records')->onDelete('cascade');
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
        Schema::table('transport_route_students', function(Blueprint $table)
        {
            $table->dropForeign('trs_transport_route_detail_id_foreign');
            $table->dropForeign('trs_student_record_id_foreign');
        });

        Schema::dropIfExists('transport_route_students');
    }
}
