<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Helpers\ApiResponse;
use App\Http\Resources\UserResource;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class AuthenticatedSessionController extends Controller
{
    private AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Display the login view.
     */
    public function create(): View
    {
        return view('auth.login');
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $result = $this->authService->loginUser($request);
        } catch (ValidationException $e) {
            return ApiResponse::error(
                null,
                $e->validator->errors()->all(),
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        } catch (\Exception $e) {
            return ApiResponse::error(null, [$e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return ApiResponse::success(
            ['user' => new UserResource($result['user']), 'token' => $result['token']],
            __('messages.logged_in')
        );
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
