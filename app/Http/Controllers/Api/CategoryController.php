<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Http\Resources\CategoryResource;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Database\Eloquent\Collection;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        // 有効なカテゴリを取得
        $categories = CategoryResource::collection(
            Category::where('deleted', false)->get()
        );

        $message = __('messages.category_list_fetched');

        return ApiResponse::success($categories, $message);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CategoryRequest $request): JsonResponse
    {
        // todo: リクエストのカテゴリ名が既に登録済みであれば弾くようにする
        // リクエストデータの検証済みデータを取得
        $validated = $request->validated();
        // カテゴリデータを登録
        $category = Category::create($validated);

        $message = __('messages.category_created');

        return ApiResponse::success(new CategoryResource($category), $message);

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
