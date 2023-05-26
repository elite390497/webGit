<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateExpensesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('expenses', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('uuid')->nullable();
            $table->bigInteger('transaction_category_id')->unsigned()->nullable();
            $table->foreign('transaction_category_id')->references('id')->on('transaction_categories')->onDelete('cascade');
            $table->bigInteger('student_record_id')->unsigned()->nullable();
            $table->foreign('student_record_id')->references('id')->on('student_records')->onDelete('cascade');
            $table->bigInteger('employee_id')->unsigned()->nullable();
            $table->foreign('employee_id')->references('id')->on('employees')->onDelete('cascade');
            $table->bigInteger('vendor_id')->unsigned()->nullable();
            $table->foreign('vendor_id')->references('id')->on('vendors')->onDelete('cascade');
            $table->bigInteger('user_id')->unsigned()->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->date('date_of_expense')->nullable();
            $table->decimal('amount',25,5)->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_cancelled')->default(0);
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
        Schema::table('expenses', function(Blueprint $table)
        {
            $table->dropForeign('expenses_transaction_category_id_foreign');
            $table->dropForeign('expenses_student_record_id_foreign');
            $table->dropForeign('expenses_employee_id_foreign');
            $table->dropForeign('expenses_vendor_id_foreign');
            $table->dropForeign('expenses_user_id_foreign');
        });

        Schema::dropIfExists('expenses');
    }
}
