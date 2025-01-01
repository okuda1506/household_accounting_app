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
            'name' => '給与',
            'transaction_type_id' => 1,
            'sort_no' => 1,
            'deleted' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        Category::create([
            'user_id' => 1,
            'name' => '副業収入',
            'transaction_type_id' => 1,
            'sort_no' => 2,
            'deleted' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        Category::create([
            'user_id' => 1,
            'name' => '食費',
            'transaction_type_id' => 2,
            'sort_no' => 1,
            'deleted' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        Category::create([
            'user_id' => 1,
            'name' => '交通費',
            'transaction_type_id' => 2,
            'sort_no' => 2,
            'deleted' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        Category::create([
            'user_id' => 1,
            'name' => '家賃',
            'transaction_type_id' => 2,
            'sort_no' => 3,
            'deleted' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
