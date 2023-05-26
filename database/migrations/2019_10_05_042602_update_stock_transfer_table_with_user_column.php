<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateStockTransferTableWithUserColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('stock_transfers', function ($table) {
            $table->string('type')->nullable()->after('id');
            $table->dropForeign('stock_transfers_student_record_id_foreign');
            $table->dropColumn('student_record_id');
            $table->bigInteger('student_id')->unsigned()->nullable()->after('room_id');
            $table->foreign('student_id')->references('id')->on('students')->onDelete('cascade');
            $table->bigInteger('user_id')->unsigned()->nullable()->after('return_description');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->uuid('upload_token')->nullable()->after('return_description');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('stock_transfers', function ($table) {
            $table->dropForeign('stock_transfers_user_id_foreign');
            $table->dropColumn('user_id');
            $table->dropForeign('stock_transfers_student_id_foreign');
            $table->dropColumn('student_id');
            $table->bigInteger('student_record_id')->unsigned()->nullable()->after('room_id');
            $table->foreign('student_record_id')->references('id')->on('student_records')->onDelete('cascade');
            $table->dropColumn('upload_token');
            $table->dropColumn('type');
        });
    }
}
