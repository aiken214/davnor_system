<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('dcp_item_statuses', function (Blueprint $table) {

            $table->unsignedBigInteger('dcp_recipient_id')->nullable();
            $table->foreign('dcp_recipient_id', 'dcp_recipient_fk_1074827')
                ->references('id')->on('dcp_recipients')
                ->onDelete('cascade')
                ->onUpdate('cascade');
            
            $table->unsignedBigInteger('dcp_item_id')->nullable();
            $table->foreign('dcp_item_id', 'dcp_item_fk_1074827')
                ->references('id')->on('dcp_items')
                ->onDelete('cascade')
                ->onUpdate('cascade');

        });
    }

};
