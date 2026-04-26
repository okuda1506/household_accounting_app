<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::create([
            'name' => 'Takuya',
            'email' => 'takuya@test.com',
            'password' => Hash::make('password'),
        ]);

        $token = $user->createToken('TestToken')->plainTextToken;

        // トークンを出力（確認用）
        echo "Generated Token: " . $token . "\n";
    }
}
