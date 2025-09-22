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
        Schema::create('dcp_item_statuses', function (Blueprint $table) {
            $table->id();
            $table->string('working')->nullable();
            $table->string('repairable')->nullable();
            $table->string('replacement')->nullable();
            $table->string('unrepairable')->nullable();
            $table->string('stolen')->nullable();
            $table->string('remarks')->nullable();
            $table->timestamps();   
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dcp_item_statuses');
    }
};
