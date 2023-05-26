<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDesignationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('designations', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('employee_category_id')->unsigned()->nullable();
            $table->foreign('employee_category_id')->references('id')->on('employee_categories')->onDelete('cascade');
            $table->string('name')->nullable();
            $table->boolean('is_teaching_employee')->default(0);
            $table->bigInteger('top_designation_id')->unsigned()->nullable();
            $table->foreign('top_designation_id')->references('id')->on('designations')->onDelete('cascade');
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
        Schema::table('designations', function(Blueprint $table)
        {
            $table->dropForeign('designations_employee_category_id_foreign');
            $table->dropForeign('designations_top_designation_id_foreign');
        });
        
        Schema::dropIfExists('designations');
    }
}
