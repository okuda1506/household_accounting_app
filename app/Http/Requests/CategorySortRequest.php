<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CategorySortRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'sorted_category_ids' => 'required|array',
            'sorted_category_ids.*' => 'integer|exists:categories,id',
        ];
    }

    public function messages(): array
    {
        return [
            'sorted_category_ids.required' => __('messages.sorted_category_ids_required'),
            'sorted_category_ids.array' => __('messages.sorted_category_ids_array'),
            'sorted_category_ids.*.integer' => __('messages.sorted_category_ids_integer'),
            'sorted_category_ids.*.exists' => __('messages.sorted_category_ids_exists'),
        ];
    }
}
