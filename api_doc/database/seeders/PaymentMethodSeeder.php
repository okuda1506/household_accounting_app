<?php

namespace Database\Seeders;

use App\Models\PaymentMethod;
use Illuminate\Database\Seeder;

class PaymentMethodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PaymentMethod::create([
            'name' => '現金',
            'deleted' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        PaymentMethod::create([
            'name' => 'クレジットカード',
            'deleted' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        PaymentMethod::create([
            'name' => '銀行振込',
            'deleted' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        PaymentMethod::create([
            'name' => '電子マネー',
            'deleted' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
