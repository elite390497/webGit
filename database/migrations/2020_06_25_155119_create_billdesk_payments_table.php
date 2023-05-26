<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBilldeskPaymentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('billdesk_payments', function (Blueprint $table) {
            $table->id();
            $table->string('reference_number')->nullable();
            $table->date('date')->nullable();
            $table->uuid('student_uuid')->nullable();
            $table->integer('student_record_id')->nullable();
            $table->decimal('total',25,5)->default(0);
            $table->decimal('amount',25,5)->default(0);
            $table->decimal('handling_fee',25,5)->default(0);
            $table->integer('installment_id')->nullable();
            $table->integer('user_id')->nullable();
            $table->boolean('status')->default(0);
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
        Schema::dropIfExists('billdesk_payments');
    }
}
