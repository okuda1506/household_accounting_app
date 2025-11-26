<?php
namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateUserNameRequest;
use App\Http\Requests\RequestEmailChangeRequest;
use App\Http\Requests\VerifyEmailChangeCodeRequest;
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

    /**
     * メールアドレス変更の認証コードを送信する
     *
     * @return JsonResponse
     */
    public function requestEmailChange(RequestEmailChangeRequest $request): JsonResponse
    {
        try {
            $this->userService->sendEmailChangeCode(
                auth()->id(),
                $request->email
            );
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error($e);
            return ApiResponse::error(null, [__('messages.server_error')], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return ApiResponse::success(null, __('messages.user_email_change_code_sent'));
    }

    /**
     * メールアドレス変更の認証コードを検証する
     *
     * @return JsonResponse
     */
    public function verifyEmailChangeCode(VerifyEmailChangeCodeRequest $request): JsonResponse
    {
        try {
            if (!$this->userService->verifyEmailChangeCode(
                auth()->id(),
                $request->email,
                $request->code
            )) {
                return ApiResponse::error(null, [__('messages.user_email_change_code_invalid')], Response::HTTP_UNPROCESSABLE_ENTITY);
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error($e);
            return ApiResponse::error(null, [__('messages.server_error')], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return ApiResponse::success(null, __('messages.user_email_change_code_verified'));
    }
}
