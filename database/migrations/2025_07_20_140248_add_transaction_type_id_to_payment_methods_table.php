<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payment_methods', function (Blueprint $table) {
            $table->foreignId('transaction_type_id')
                ->default(2)
                ->after('name')
                ->constrained('transaction_types')
                ->cascadeOnDelete()
                ->comment('取引タイプID');
        });
    }

    public function down(): void
    {
        Schema::table('payment_methods', function (Blueprint $table) {
            $table->dropForeign(['transaction_type_id']);
            $table->dropColumn('transaction_type_id');
        });
    }
};