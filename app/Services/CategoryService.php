<?php

namespace App\Services;

use App\Models\Category;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Response;
use Illuminate\Database\Eloquent\ModelNotFoundException;

/**
 * カテゴリ関連のビジネスロジックを管理するサービスクラス
 *
 * - createCategory(): 新しいカテゴリを作成
 * - updateCategory(): 既存のカテゴリを更新
 * - deleteCategory(): カテゴリを論理削除
 * - sortCategories(): カテゴリの並び順を更新
 * - categoryExists(): 同じ名前のカテゴリが存在するかチェック
 * - findCategoryByIdAndUser(): 指定ユーザーのカテゴリを取得（共通メソッド）
 */
class CategoryService
{
    // 削除フラグOFF
    const IS_NOT_DELETED = 0;

    /**
     * カテゴリの新規登録
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

        try {
            DB::beginTransaction();
            $category = Category::create($data);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

        return $category;
    }

    /**
     * カテゴリの更新
     *
     * @param string $categoryId カテゴリID
     * @param array $data カテゴリデータ
     * @param int $userId ユーザーID
     *
     * @return Category
     */
    public function updateCategory(string $categoryId, array $data, int $userId): Category
    {
        $category = $this->findCategoryByIdAndUser($categoryId, $userId);

        if ($this->categoryExistsForUpdate($data['name'], $userId, $data['transaction_type_id'], $categoryId)) {
            throw new \Exception(__('messages.category_name_exists', ['name' => $data['name']]), Response::HTTP_CONFLICT);
        }

        try {
            DB::beginTransaction();
            $category->update($data);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

        return $category;
    }

    /**
     * カテゴリの削除
     *
     * @param string $categoryId カテゴリID
     * @param int $userId ユーザーID
     *
     * @return void
     */
    public function deleteCategory(string $categoryId, int $userId): void
    {
        $category = $this->findCategoryByIdAndUser($categoryId, $userId);

        try {
            DB::beginTransaction();
            $category->delete();
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
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
     * 指定されたカテゴリIDとユーザーIDに一致するカテゴリを取得する
     *
     * @param string $categoryId カテゴリID
     * @param int $userId ユーザーID
     * @return Category
     * @throws \Exception
     */
    private function findCategoryByIdAndUser(string $categoryId, int $userId): Category
    {
        try {
            return Category::where('id', $categoryId)
                ->where('user_id', $userId)
                ->where('deleted', self::IS_NOT_DELETED)
                ->firstOrFail();
        } catch (ModelNotFoundException $e) {
            throw new \Exception(__('messages.category_not_found'), Response::HTTP_NOT_FOUND);
        }
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
