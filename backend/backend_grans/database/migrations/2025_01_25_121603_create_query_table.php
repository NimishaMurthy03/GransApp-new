<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('queries', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('employee_id')->default(1);
            $table->foreign('employee_id')
                ->references('id')
                ->on('staff')
                ->onDelete('cascade');

            $table->enum('problem_statement', ['Technical Issue', 'Billing Issue', 'General Query','Quotation Request','Other']);

            // NEW correct field
            $table->string('description')->nullable();

            $table->string('name');
            $table->bigInteger('phone_number');
            $table->string('company_name');
            $table->string('email');

            // NEW (you added photo)
            $table->string('photo')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('queries');
    }
};
