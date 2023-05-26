<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateStudentRecordsWithUploadToken extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('student_records', function (Blueprint $table) {
            $table->string('termination_reason')->nullable()->after('exit_remarks');
            $table->uuid('upload_token')->nullable()->after('termination_reason');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('student_records', function(Blueprint $table)
        {
            $table->dropColumn('termination_reason');
            $table->dropColumn('upload_token');
        });
    }
}
