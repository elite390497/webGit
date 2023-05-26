<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateLessonPlansTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('lesson_plans', function (Blueprint $table) {
            $table->uuid('uuid')->nullable()->after('id');
            $table->text('topic')->nullable()->change();
            $table->uuid('upload_token')->nullable()->after('is_locked');
            $table->dropForeign('lesson_plans_batch_id_foreign');
            $table->dropColumn('batch_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('lesson_plans', function(Blueprint $table)
        {
            $table->dropColumn('uuid');
            $table->string('topic')->nullable()->change();
            $table->dropColumn('upload_token');
            $table->bigInteger('batch_id')->unsigned()->nullable()->after('id');
            $table->foreign('batch_id')->references('id')->on('batches')->onDelete('cascade');
        });
    }
}
