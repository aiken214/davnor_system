<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sbm_responses', function (Blueprint $table) {

            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id', 'user_fk_1013926')
                ->references('id')->on('users')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            $table->unsignedBigInteger('sbm_checklist_id')->nullable();
            $table->foreign('sbm_checklist_id', 'sbm_checklist_fk_1013927')
                ->references('id')->on('sbm_checklists')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });
    }

};
