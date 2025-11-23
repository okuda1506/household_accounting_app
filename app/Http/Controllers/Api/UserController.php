<?php
namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateUserNameRequest;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class UserController extends Controller
{
    private UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * ユーザー名を更新する
     *
     * @return JsonResponse
     */
    public function updateName(UpdateUserNameRequest $request): JsonResponse
    {
        try {
            $this->userService->updateUserName(auth()->id(),$request->input('name'));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error($e);
            return ApiResponse::error(null, [__('messages.server_error')], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return ApiResponse::success(null, __('messages.user_name_updated'));
    }
}
