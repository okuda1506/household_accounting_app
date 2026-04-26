<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Transaction;

class TransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Transaction::create([
            'user_id' => 1,
            'transaction_date' => now(),
            'transaction_type_id' => 1,
            'category_id' => 1,
            'amount' => 500000,
            'payment_method_id' => 3,
            'memo' => '1月給料',
            'deleted' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        Transaction::create([
            'user_id' => 1,
            'transaction_date' => now(),
            'transaction_type_id' => 2,
            'category_id' => 4,
            'amount' => 7800,
            'payment_method_id' => 2,
            'memo' => '1月の通勤定期券',
            'deleted' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        Transaction::create([
            'user_id' => 1,
            'transaction_date' => now(),
            'transaction_type_id' => 2,
            'category_id' => 5,
            'amount' => 100000,
            'payment_method_id' => 3,
            'memo' => '1月家賃',
            'deleted' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
