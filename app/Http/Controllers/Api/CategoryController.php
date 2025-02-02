<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Services\CategoryService;
use App\Http\Requests\CategorySortRequest;
use App\Http\Resources\CategoryResource;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Database\Eloquent\Collection;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

// todo: ログインユーザーのみのデータについてCRUDができるようにする（モデルのfillable修正など）

class CategoryController extends Controller
{
    private CategoryService $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }
    /**
     * 有効なカテゴリをソート番号の昇順で取得
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $categories = CategoryResource::collection(
            Category::where('deleted', false)->orderBy('sort_no')->get()
        );

        $message = __('messages.category_list_fetched');

        return ApiResponse::success($categories, $message);
    }

    /**
     * カテゴリの新規登録
     *
     * @param CategoryRequest $request
     *
     * @return JsonResponse
     */
    public function store(CategoryRequest $request): JsonResponse
    {
        // リクエストデータの検証済みデータを取得する
        $validated = $request->validated();

        // todo: 共通化
        // リクエストのカテゴリ名が既に存在している場合はエラーレスポンスを返す
        if (Category::where([
            ['name', '=', $validated['name']],
            ['transaction_type_id', '=', $validated['transaction_type_id']],
            ['deleted', '=', false]
        ])->exists()) {
            $errorMessages = [];
            $errorMessages[] = __('messages.category_name_exists', ['name' => $validated['name']]);

            return ApiResponse::error(null, $errorMessages, Response::HTTP_CONFLICT);
        }

        // カテゴリ登録する
        $category = Category::create($validated);
        $message = __('messages.category_created');

        return ApiResponse::success(new CategoryResource($category), $message);
    }

    /**
     * カテゴリの更新
     *
     * @param CategoryRequest $request
     *
     * @param string $id
     *
     * @return JsonResponse
     */
    public function update(CategoryRequest $request, string $id): JsonResponse
    {
        $validated = $request->validated();

        $category = Category::where(['id' => $id, 'deleted' => false])->firstOrFail();

        // todo: 共通化
        // リクエストのカテゴリ名が既に存在している場合はエラーレスポンスを返す
        if (Category::where([
            ['name', '=', $validated['name']],
            ['id', '!=', $id],
            ['transaction_type_id', '=', $validated['transaction_type_id']],
            ['deleted', '=', false]
        ])->exists()) {
            $errorMessages = [];
            $errorMessages[] = __('messages.category_name_exists', ['name' => $validated['name']]);

            return ApiResponse::error(null, $errorMessages, Response::HTTP_CONFLICT);
        }

        $category->update($validated);
        $message = __('messages.category_updated');

        return ApiResponse::success(new CategoryResource($category), $message);
    }

    /**
     * カテゴリの削除
     *
     * @param CategoryRequest $request
     *
     * @param string $id
     *
     * @return JsonResponse
     */
    public function destroy(string $id): JsonResponse
    {
        $category = Category::findOrFail($id);

        $category->delete();

        $message = __('messages.category_deleted');

        return ApiResponse::success(new CategoryResource($category), $message);
    }

    /**
     * カテゴリのソート
     *
     * @param CategorySortRequest $request
     *
     * @return JsonResponse
     */
    public function sort(CategorySortRequest $request): JsonResponse
    {
        $sortedCategoryIds = $request->input('sorted_category_ids');

        // todo: Exception起きた場合はエラーレスポンスを返すようにしたい（この制御はController側で行う...?_）
        $this->categoryService->sortCategories($sortedCategoryIds);


        // return ApiResponse::success(new CategoryResource($category), $message);
        return ApiResponse::success(null, __('messages.category_sorted'));
    }
}
