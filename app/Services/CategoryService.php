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
        // todo: Exception起きた場合はエラーレスポンスを返すようにしたい（この制御はController側で行う?）
        DB::transaction(function () use ($sortedCategoryIds) {
            // 取引タイプごとにグループ化して取得
            $categories = Category::whereIn('id', $sortedCategoryIds)
                ->orderByRaw("FIELD(id, " . implode(',', $sortedCategoryIds) . ")") // フロントから送られたIDの並び順を保持
                ->get()
                ->groupBy('transaction_type_id'); // 取引タイプごとに別々のリストとする

            // 各取引タイプごとに sort_no を更新
            foreach ($categories as $transactionTypeId => $groupedCategories) {
                foreach ($groupedCategories as $index => $category) {
                    $category->update(['sort_no' => $index + 1]);
                }
            }
        });
    }
}
