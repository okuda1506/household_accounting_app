<?php

namespace App\Services;

use App\Models\Category;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Response;

class CategoryService
{
    /**
     * 新規登録
     *
     * @param array $data カテゴリデータ
     * @param int $userId ユーザーID
     *
     * @return Category
     */
    public function createCategory(array $data, int $userId): Category
    {
        $categoryName = $data['name'];
        $transactionTypeId = $data['transaction_type_id'];

        if ($this->categoryExists($categoryName, $userId, $transactionTypeId)) {
            throw new \Exception(__('messages.category_name_exists', ['name' => $categoryName]), Response::HTTP_CONFLICT);
        }

        $data['user_id'] = $userId;
        $category = Category::create($data);

        return $category;
    }

    /**
     * 更新
     *
     * @param string $categoryId カテゴリID
     * @param array $data カテゴリデータ
     * @param int $userId ユーザーID
     *
     * @return Category
     */
    public function updateCategory(string $categoryId, array $data, int $userId): Category
    {
        $category = Category::findOrFail($categoryId);

        if ($this->categoryExistsForUpdate($data['name'], $userId, $data['transaction_type_id'], $categoryId)) {
            throw new \Exception(__('messages.category_name_exists', ['name' => $data['name']]), Response::HTTP_CONFLICT);
        }

        $category->update($data);

        return $category;
    }

    /**
     * 削除
     *
     * @param string $categoryId カテゴリID
     * @param int $userId ユーザーID
     *
     * @return void
     */
    public function deleteCategory(string $categoryId, int $userId): void
    {
        $category = Category::findOrFail($categoryId);

        if ($category->user_id !== $userId) {
            throw new \Exception(__('messages.unauthorized'), Response::HTTP_FORBIDDEN);
        }

        $category->delete();
    }


    /**
     * ユーザーが所有しているカテゴリの存在チェック
     *
     * @param string $categoryName カテゴリ名
     * @param int $userId ユーザーID
     * @param string $transactionTypeId 取引タイプID
     *
     * @return bool
     */
    public function categoryExists(string $categoryName, int $userId, string $transactionTypeId): bool
    {
        return Category::where([
            ['name', '=', $categoryName],
            ['user_id', '=', $userId],
            ['transaction_type_id', '=', $transactionTypeId],
            ['deleted', '=', false]
        ])->exists();
    }

    /**
     * ユーザーが所有している自分自身以外のカテゴリの存在チェック
     *
     * @param string $categoryName カテゴリ名
     * @param int $userId ユーザーID
     * @param string $transactionTypeId 取引タイプID
     * @param string $categoryId カテゴリID
     *
     * @return bool
     */
    public function categoryExistsForUpdate(string $categoryName, int $userId, string $transactionTypeId, string $categoryId): bool
    {
        return Category::where([
            ['name', '=', $categoryName],
            ['user_id', '=', $userId],
            ['transaction_type_id', '=', $transactionTypeId],
            ['deleted', '=', false],
            ['id', '!=', $categoryId],
        ])->exists();
    }

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
