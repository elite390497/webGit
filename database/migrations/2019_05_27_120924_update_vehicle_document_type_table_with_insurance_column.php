<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateVehicleDocumentTypeTableWithInsuranceColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('vehicle_document_types', function (Blueprint $table) {
            $table->boolean('is_insurance_document')->nullable()->after('has_expiry_date');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('vehicle_document_types', function(Blueprint $table)
        {
            $table->dropColumn('is_insurance_document');
        });
    }
}
