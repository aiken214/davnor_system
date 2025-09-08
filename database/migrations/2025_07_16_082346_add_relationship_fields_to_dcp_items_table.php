<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('dcp_items', function (Blueprint $table) {

            $table->unsignedBigInteger('dcp_id')->nullable();
            $table->foreign('dcp_id', 'dcp_fk_1013926')
                ->references('id')->on('dcps')
                ->onDelete('cascade')
                ->onUpdate('cascade');

        });
    }

};
