<?php

namespace App\Helpers;

use Illuminate\Http\JsonResponse;

class ApiResponse
{
    public static function success(mixed $data = null, string $message = 'リクエスト成功'): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ]);
    }

    public static function error(mixed $data = null, array $errorMessages = [], int $statusCode = 400): JsonResponse
    {
        return response()->json([
            'success' => false,
            'messages' => $errorMessages,
            'data' => $data,
        ], $statusCode);
    }
}
