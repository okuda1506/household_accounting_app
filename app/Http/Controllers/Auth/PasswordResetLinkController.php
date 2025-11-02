<?php

namespace App\Http\Controllers\Auth;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\ReactivateAccount;
use App\Services\AuthService;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class PasswordResetLinkController extends Controller
{
    /**
     * Handle an incoming password reset link request.
     */
    private AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $result = $this->authService->sendPasswordResetLink($request);
        } catch (\Throwable $e) {
            if ($e instanceof \Illuminate\Validation\ValidationException) {
                $errors = $e->errors();
                $status = Response::HTTP_UNPROCESSABLE_ENTITY;
            } else {
                \Illuminate\Support\Facades\Log::error($e);
                $errors = [__('messages.server_error')];
                $status = Response::HTTP_INTERNAL_SERVER_ERROR;
            }

            return ApiResponse::error(null, $errors, $status);
        }

        $errorMap = [
            Password::INVALID_USER => [__('messages.user_email_invalid'), Response::HTTP_UNPROCESSABLE_ENTITY],
        ];

        if (isset($errorMap[$result['status']])) {
            [$message, $status] = $errorMap[$result['status']];
            return ApiResponse::error(null, [$message], $status);
        }

        return ApiResponse::success(null, __('messages.user_send_password_reset_link'));
    }
}
