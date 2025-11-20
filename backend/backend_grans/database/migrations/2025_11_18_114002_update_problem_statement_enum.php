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
        DB::statement("
            ALTER TABLE queries 
            MODIFY problem_statement 
            ENUM(
                'Technical Issue', 
                'Billing Issue', 
                'General Query',
                'Quotation Request',
                'Other'
            )
        ");
    }

    public function down()
    {
        DB::statement("
            ALTER TABLE queries 
            MODIFY problem_statement 
            ENUM(
                'Technical Issue', 
                'Billing Issue', 
                'General Query'
            )
        ");
    }
};
