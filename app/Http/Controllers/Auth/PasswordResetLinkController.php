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
            $status = $this->authService->sendPasswordResetLink($request);

            return ApiResponse::success(['status' => __($status)], __('passwords.sent'));
        } catch (ValidationException $e) {
            return ApiResponse::error(
                __('messages.validation_error'),
                $e->errors(),
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error($e);
            return ApiResponse::error(__('messages.server_error'), [$e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
