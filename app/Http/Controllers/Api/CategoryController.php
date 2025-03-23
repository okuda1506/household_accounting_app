<?php
namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Http\Requests\CategorySortRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Services\CategoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class CategoryController extends Controller
{
    private CategoryService $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    /**
     * 有効なカテゴリ一覧を取得する
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $categories = CategoryResource::collection(
                $this->categoryService->getAllCategories(auth()->id())
            );
        } catch (\Exception $e) {
            return ApiResponse::error(null, [__('messages.category_get_failed')], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
        // todo: カテゴリ分けはフロントで行う
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
            return ApiResponse::error(null, [$e->getMessage()], (int) $e->getCode() ?: Response::HTTP_INTERNAL_SERVER_ERROR);
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
            return ApiResponse::error(null, [$e->getMessage()], (int) $e->getCode() ?: Response::HTTP_INTERNAL_SERVER_ERROR);
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
            return ApiResponse::error(null, [$e->getMessage()], (int) $e->getCode() ?: Response::HTTP_INTERNAL_SERVER_ERROR);
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
