<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TransactionType;

class TransactionTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TransactionType::create([
            'name' => '収入',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        TransactionType::create([
            'name' => '支出',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
