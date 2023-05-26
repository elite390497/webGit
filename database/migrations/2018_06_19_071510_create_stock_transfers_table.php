<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStockTransfersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('stock_transfers', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('room_id')->unsigned()->nullable();
            $table->foreign('room_id')->references('id')->on('rooms')->onDelete('cascade');
            $table->bigInteger('student_record_id')->unsigned()->nullable();
            $table->foreign('student_record_id')->references('id')->on('student_records')->onDelete('cascade');
            $table->bigInteger('employee_id')->unsigned()->nullable();
            $table->foreign('employee_id')->references('id')->on('employees')->onDelete('cascade');
            $table->date('date')->nullable();
            $table->date('return_due_date')->nullable();
            $table->date('return_date')->nullable();
            $table->string('return_status',20)->nullable();
            $table->text('description')->nullable();
            $table->text('return_description')->nullable();
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
        Schema::table('stock_transfers', function(Blueprint $table)
        {
            $table->dropForeign('stock_transfers_room_id_foreign');
            $table->dropForeign('stock_transfers_student_record_id_foreign');
            $table->dropForeign('stock_transfers_employee_id_foreign');
        });

        Schema::dropIfExists('stock_transfers');
    }
}
