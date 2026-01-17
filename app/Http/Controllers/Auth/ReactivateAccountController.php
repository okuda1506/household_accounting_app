<?php

namespace App\Http\Controllers\Auth;

use App\Http\Requests\Auth\ReactivateAccountRequest;
use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Password;

class ReactivateAccountController extends Controller
{
    private AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Handle an incoming new password request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(ReactivateAccountRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->reactivateAccount($request->validated());
        } catch (\Throwable $e) {
            if ($e instanceof \Illuminate\Validation\ValidationException) {
                $errors = $e->validator->errors()->all();
                $status = Response::HTTP_UNPROCESSABLE_ENTITY;
            } else {
                \Illuminate\Support\Facades\Log::error($e);
                $errors = [__('messages.server_error')];
                $status = Response::HTTP_INTERNAL_SERVER_ERROR;
            }

            return ApiResponse::error(null, $errors, $status);
        }

        $errorMap = [
            Password::INVALID_USER  => [__('messages.user_email_invalid'), Response::HTTP_UNPROCESSABLE_ENTITY],
            Password::INVALID_TOKEN => [__('messages.user_token_invalid'), Response::HTTP_BAD_REQUEST],
        ];

        if (isset($errorMap[$result['status']])) {
            [$message, $status] = $errorMap[$result['status']];

            return ApiResponse::error(null, [$message], $status);
        }

        return ApiResponse::success(null, __('messages.user_account_reactivated'));
    }
}
