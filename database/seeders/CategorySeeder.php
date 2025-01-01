<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Category::create([
            'user_id' => 1,
            'name' => '',
            'transaction_types_id' => 1,
            'sort_no' => 1,
            'deleted' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
