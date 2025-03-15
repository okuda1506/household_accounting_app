<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Services\CategoryService;
use App\Http\Requests\CategorySortRequest;
use App\Http\Resources\CategoryResource;
use Illuminate\Http\Response;
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
            $category = $this->categoryService->createCategory($request->validated(), auth()->id());
        } catch (\Exception $e) {
            return ApiResponse::error(null, [$e->getMessage()], (int)$e->getCode() ?: Response::HTTP_INTERNAL_SERVER_ERROR);
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
            $category = $this->categoryService->updateCategory($categoryId, $request->validated(), auth()->id());
        } catch (\Exception $e) {
            return ApiResponse::error(null, [$e->getMessage()], (int)$e->getCode() ?: Response::HTTP_INTERNAL_SERVER_ERROR);
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
            $this->categoryService->deleteCategory($categoryId, auth()->id());
        } catch (\Exception $e) {
            return ApiResponse::error(null, [$e->getMessage()], (int)$e->getCode() ?: Response::HTTP_INTERNAL_SERVER_ERROR);
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
