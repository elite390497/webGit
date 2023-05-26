<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTransactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('uuid')->nullable();
            $table->string('prefix',20)->nullable();
            $table->integer('number')->default(0);
            $table->tinyInteger('type')->default(0);
            $table->bigInteger('user_id')->unsigned()->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->bigInteger('bill_id')->unsigned()->nullable();
            $table->foreign('bill_id')->references('id')->on('bills')->onDelete('cascade');
            $table->bigInteger('income_id')->unsigned()->nullable();
            $table->foreign('income_id')->references('id')->on('incomes')->onDelete('cascade');
            $table->bigInteger('expense_id')->unsigned()->nullable();
            $table->foreign('expense_id')->references('id')->on('expenses')->onDelete('cascade');
            $table->bigInteger('account_transfer_id')->unsigned()->nullable();
            $table->foreign('account_transfer_id')->references('id')->on('account_transfers')->onDelete('cascade');
            $table->bigInteger('payment_method_id')->unsigned()->nullable();
            $table->foreign('payment_method_id')->references('id')->on('payment_methods')->onDelete('cascade');
            $table->decimal('amount',25,5)->default(0);
            $table->bigInteger('account_id')->unsigned()->nullable();
            $table->foreign('account_id')->references('id')->on('accounts')->onDelete('cascade');
            $table->string('head')->nullable();
            $table->bigInteger('registration_id')->unsigned()->nullable();
            $table->foreign('registration_id')->references('id')->on('registrations')->onDelete('cascade');
            $table->bigInteger('student_fee_record_id')->unsigned()->nullable();
            $table->foreign('student_fee_record_id')->references('id')->on('student_fee_records')->onDelete('cascade');
            $table->bigInteger('book_log_detail_id')->unsigned()->nullable();
            $table->foreign('book_log_detail_id')->references('id')->on('book_log_details')->onDelete('cascade');
            $table->bigInteger('transaction_group_id')->unsigned()->nullable();
            $table->foreign('transaction_group_id')->references('id')->on('transactions')->onDelete('cascade');
            $table->string('instrument_number')->nullable();
            $table->string('instrument_bank_detail')->nullable();
            $table->string('reference_number')->nullable();
            $table->date('instrument_date')->nullable();
            $table->date('instrument_clearing_date')->nullable();
            $table->date('date')->nullable();
            $table->date('date_of_reconciliation')->nullable();
            $table->boolean('is_cancelled')->default(0);
            $table->text('cancellation_remarks')->nullable();
            $table->dateTime('cancelled_at')->nullable();
            $table->text('remarks')->nullable();
            $table->uuid('upload_token')->nullable();
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
        Schema::table('transactions', function(Blueprint $table)
        {
            $table->dropForeign('transactions_user_id_foreign');
            $table->dropForeign('transactions_account_id_foreign');
            $table->dropForeign('transactions_account_transfer_id_foreign');
            $table->dropForeign('transactions_registration_id_foreign');
            $table->dropForeign('transactions_payment_method_id_foreign');
            $table->dropForeign('transactions_bill_id_foreign');
            $table->dropForeign('transactions_income_id_foreign');
            $table->dropForeign('transactions_expense_id_foreign');
            $table->dropForeign('transactions_student_fee_record_id_foreign');
            $table->dropForeign('transactions_book_log_detail_id_foreign');
            $table->dropForeign('transactions_transaction_group_id_foreign');
        });

        Schema::dropIfExists('transactions');
    }
}
