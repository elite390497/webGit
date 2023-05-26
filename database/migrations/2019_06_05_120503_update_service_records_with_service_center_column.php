<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateServiceRecordsWithServiceCenterColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('vehicle_service_records', function (Blueprint $table) {
            $table->bigInteger('vehicle_service_center_id')->unsigned()->nullable()->after('vehicle_id');
            $table->foreign('vehicle_service_center_id', 'vsr_vehicle_service_center_id_foreign')->references('id')->on('vehicle_service_centers')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('vehicle_service_records', function(Blueprint $table)
        {
            $table->dropForeign('vsr_vehicle_service_center_id_foreign');
            $table->dropColumn('vehicle_service_center_id');
        });
    }
}
