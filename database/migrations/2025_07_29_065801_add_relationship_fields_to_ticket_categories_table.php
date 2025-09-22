<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ticket_categories', function (Blueprint $table) {

            $table->unsignedBigInteger('office_id')->nullable();
            $table->foreign('office_id', 'offic_fk_1065801')
                ->references('id')->on('offices')
                ->onDelete('cascade')
                ->onUpdate('cascade');


        });
    }

};
