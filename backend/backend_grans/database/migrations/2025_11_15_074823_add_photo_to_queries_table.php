<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('queries', function (Blueprint $table) {
        if (!Schema::hasColumn('queries', 'photo')) {
            $table->string('photo')->nullable()->after('email');
        }
    });
}

public function down()
{
    Schema::table('queries', function (Blueprint $table) {
        if (Schema::hasColumn('queries', 'photo')) {
            $table->dropColumn('photo');
        }
    });
}

};
