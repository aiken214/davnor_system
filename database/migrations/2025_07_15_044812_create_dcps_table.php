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
        Schema::create('dcps', function (Blueprint $table) {
            $table->id();
            $table->string('batch');
            $table->string('year');
            $table->string('configuration', 10000);
            $table->string('supplier');
            $table->string('slug')->unique();
            $table->string('file')->nullable();
            $table->boolean('status')->default(true);
            $table->string('remarks', 500)->nullable();
            $table->timestamps();        
            $table->softDeletes(); //added
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dcps');
    }
};
