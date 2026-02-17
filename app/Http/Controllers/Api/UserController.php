<?php
namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateUserNameRequest;
use App\Http\Requests\RequestEmailChangeRequest;
use App\Http\Requests\VerifyEmailChangeCodeRequest;
use App\Http\Requests\UpdateUserEmailRequest;
use App\Http\Requests\UpdateUserPasswordRequest;
use App\Http\Requests\UpdateBudgetRequest;
use App\Http\Requests\UpdateAiAdviceModeRequest;
use App\Http\Resources\UserResource;
use App\Services\UserService;
use App\Exceptions\Domain\InvalidCurrentPasswordException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

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
     * @return mixed|null
     */
    public function show(Request $request): mixed
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
            Log::error($e);
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
            Log::error($e);
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
            Log::error($e);
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
            Log::error($e);
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

    /**
     * パスワードを更新する
     *
     * @return JsonResponse
     */
    public function updatePassword(UpdateUserPasswordRequest $request): JsonResponse
    {
        try {
            $this->userService->updatePassword(auth()->id(), $request->current_password, $request->new_password);
        } catch (InvalidCurrentPasswordException $e) {
            return ApiResponse::error(null, [__($e->messageKey())], $e->status());
        } catch (\Exception $e) {
            Log::error($e);
            return ApiResponse::error(null, [__('messages.server_error')], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return ApiResponse::success(null, __('messages.user_password_updated'));
    }

    /**
     * 予算を更新する
     *
     * @return JsonResponse
     */
    public function updateBudget(UpdateBudgetRequest $request): JsonResponse
    {
        try {
            $this->userService->updateBudget(auth()->id(), (int) $request->input('budget'));
        } catch (\Exception $e) {
            Log::error($e);
            return ApiResponse::error(null, [__('messages.server_error')], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return ApiResponse::success(null, __('messages.user_budget_updated'));
    }

    /**
     * AIアドバイスモードを更新する
     *
     * @return JsonResponse
     */
    public function updateAiAdviceMode(UpdateAiAdviceModeRequest $request): JsonResponse
    {
        try {
            $user = $this->userService->updateAiAdviceMode(auth()->id(), (bool) $request->input('ai_advice_mode'));
        } catch (\Exception $e) {
            Log::error($e);
            return ApiResponse::error(null, [__('messages.server_error')], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return ApiResponse::success([
        'ai_advice_mode' => $user['ai_advice_mode'],
    ], __('messages.user_ai_advice_mode_updated'));
    }
}
