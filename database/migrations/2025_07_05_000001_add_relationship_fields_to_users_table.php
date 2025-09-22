<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {

            $table->unsignedBigInteger('school_id')->nullable();
            $table->foreign('school_id', 'school_fk_1016117')
                ->references('id')->on('schools')
                ->onDelete('cascade')
                ->onUpdate('cascade');

        });
    }

};
