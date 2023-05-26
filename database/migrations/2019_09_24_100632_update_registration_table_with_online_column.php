<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateRegistrationTableWithOnlineColumn extends Migration {
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up() {
		Schema::table('registrations', function (Blueprint $table) {
			$table->boolean('is_online')->default(0)->after('status');
			$table->string('registration_key')->nullable()->after('is_online');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down() {
		Schema::table('registrations', function (Blueprint $table) {
			$table->dropColumn('is_online');
			$table->dropColumn('registration_key');
		});
	}
}
