<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateStudentAttendanceTableWithSessionColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('student_attendances', function ($table) {
            $table->string('session')->nullable()->after('subject_id');
            $table->string('is_default')->default(0)->after('session');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('student_attendances', function ($table) {
            $table->dropColumn('session');
            $table->dropColumn('is_default');
        });
    }
}
