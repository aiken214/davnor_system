<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sbm_checklists', function (Blueprint $table) {

            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id', 'user_fk_1063504')
                ->references('id')->on('users')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });
    }

};
