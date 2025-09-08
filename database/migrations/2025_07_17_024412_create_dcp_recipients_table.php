<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('dcp_recipients', function (Blueprint $table) {
            $table->id();
            $table->string('allocation')->nullable();
            $table->string('date_delivery')->nullable();
            $table->string('slug')->unique();
            $table->string('file')->nullable();
            $table->string('remarks', 500)->nullable();
            $table->timestamps();        
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dcp_recipients');
    }
};
