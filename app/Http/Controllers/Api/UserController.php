<?php
namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateUserNameRequest;
use App\Http\Requests\RequestEmailChangeRequest;
use App\Http\Requests\VerifyEmailChangeCodeRequest;
use App\Http\Requests\UpdateUserEmailRequest;
use App\Http\Resources\UserResource;
use App\Services\UserService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
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
     * 認証済みユーザー情報を取得する
     *
     * @param Request $request
     * @return \Illuminate\Contracts\Auth\Authenticatable|null
     */
    public function show(Request $request)
    {
        return $request->user();
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
            if ($error = $this->checkEmailChangeCode($request->email, $request->code)) {
                return $error;
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error($e);
            return ApiResponse::error(null, [__('messages.server_error')], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return ApiResponse::success(null, __('messages.user_email_change_code_verified'));
    }

    /**
     * メールアドレスを更新する
     *
     * @return JsonResponse
     */
    public function updateEmail(UpdateUserEmailRequest $request): JsonResponse
    {
        try {
            if ($error = $this->checkEmailChangeCode($request->email, $request->code)) {
                return $error;
            }

            $user = $this->userService->updateEmail(auth()->id(), $request->email);
        } catch (ModelNotFoundException $e) {
            return ApiResponse::error(null, [__('messages.user_not_found')], Response::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error($e);
            return ApiResponse::error(null, [__('messages.server_error')], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return ApiResponse::success(new UserResource($user), __('messages.user_email_updated'));
    }

    /**
     * メールアドレス変更の認証コードを検証する
     *
     * @param string $email
     * @param string $code
     *
     * @return null|JsonResponse
     */
    private function checkEmailChangeCode(string $email, string $code): ?JsonResponse
    {
        if (!$this->userService->verifyEmailChangeCode(auth()->id(), $email, $code)) {
            return ApiResponse::error(null, [__('messages.user_email_change_code_invalid')], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return null;
    }
}
