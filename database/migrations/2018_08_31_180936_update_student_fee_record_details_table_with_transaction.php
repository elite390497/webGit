<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateStudentFeeRecordDetailsTableWithTransaction extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('student_fee_record_details', function ($table) {
            $table->bigInteger('transaction_id')->unsigned()->nullable()->after('amount');
            $table->foreign('transaction_id')->references('id')->on('transactions')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('student_fee_record_details', function ($table) {
            $table->dropForeign('student_fee_record_details_transaction_id_foreign');
            $table->dropColumn('transaction_id');
        });
    }
}
