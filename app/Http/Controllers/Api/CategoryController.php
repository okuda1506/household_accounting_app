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

class CategoryController extends Controller
{
    private CategoryService $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    // todo: 取引タイプ別で出すのでこの辺り修正が必要になりそう
    /**
     * 有効なカテゴリを取得
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $categories = CategoryResource::collection(
                Category::where('deleted', false)->where('user_id', auth()->id())->orderBy('sort_no')->get()
            );
        } catch (\Exception $e) {
            return ApiResponse::error(null, [__('messages.category_get_failed')], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return ApiResponse::success($categories, __('messages.category_list_fetched'));
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
        try {
            $validated = $request->validated();
            $userId = auth()->id();

            $category = $this->categoryService->storeCategory($validated, $userId);
        } catch (\Exception $e) {
            return ApiResponse::error(null, [$e->getMessage()], $e->getCode() ?: Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return ApiResponse::success(new CategoryResource($category), __('messages.category_created'));
    }

    /**
     * カテゴリの更新
     *
     * @param CategoryRequest $request
     * @param string $categoryId
     *
     * @return JsonResponse
     */
    public function update(CategoryRequest $request, string $categoryId): JsonResponse
    {
        try {
            $validated = $request->validated();
            $userId = auth()->id();
            $category = $this->categoryService->updateCategory($categoryId, $validated, $userId);
        } catch (\Exception $e) {
            return ApiResponse::error(null, [$e->getMessage()], $e->getCode() ?: Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return ApiResponse::success(new CategoryResource($category), __('messages.category_updated'));
    }

    /**
     * カテゴリの削除
     *
     * @param CategoryRequest $request
     * @param string $id
     *
     * @return JsonResponse
     */
    public function destroy(string $categoryId): JsonResponse
    {
        try {
            $userId = auth()->id();
            $this->categoryService->deleteCategory($categoryId, $userId);
        } catch (\Exception $e) {
            return ApiResponse::error(null, [$e->getMessage()], $e->getCode() ?: Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return ApiResponse::success(null, __('messages.category_deleted'));
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
        try {
            $sortedCategoryIds = $request->input('sorted_category_ids');
            $this->categoryService->sortCategories($sortedCategoryIds);
        } catch (\Exception $e) {
            return ApiResponse::error(null, __('messages.category_sort_failed'), Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return ApiResponse::success(null, __('messages.category_sorted'));
    }
}
