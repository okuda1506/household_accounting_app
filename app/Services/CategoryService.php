<?php

namespace App\Services;

use App\Models\Category;
use Illuminate\Support\Facades\DB;

class CategoryService
{
    /**
     * カテゴリの並び順を更新する
     *
     * @param array $sortedCategoryIds 並び替え後のカテゴリIDリスト
     * @return void
     */
    public function sortCategories(array $sortedCategoryIds): void
    {
        // todo: Exception起きた場合はエラーレスポンスを返すようにしたい（この制御はController側で行う...?_）
        DB::transaction(function () use ($sortedCategoryIds) {
            foreach ($sortedCategoryIds as $index => $categoryId) {
                Category::where('id', $categoryId)->update(['sort_no' => $index + 1]);
            }
        });
    }
}
