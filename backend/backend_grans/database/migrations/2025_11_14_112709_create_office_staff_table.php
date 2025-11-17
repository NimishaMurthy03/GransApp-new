<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('office_staff', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('role')->nullable(); // optional
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('password'); // IMPORTANT
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('office_staff');
    }
};
