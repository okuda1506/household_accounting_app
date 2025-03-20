<?php
namespace App\Http\Requests;

use App\Models\Category;
use Illuminate\Foundation\Http\FormRequest;

class CategoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        if (! auth()->check()) {
            return false;
        }

        if ($this->routeIs('api.category.store')) {
            return true;
        }

        // 更新・削除は自身のデータのみ許可
        if ($this->routeIs('api.category.update') || $this->routeIs('api.category.destroy')) {
            $categoryId = $this->route('id');
            return Category::where('id', $categoryId)
                ->where('user_id', auth()->id())
                ->exists();
        }

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
            'name'                => 'required|string|max:30',
            'transaction_type_id' => 'required|integer|exists:transaction_types,id',
            'sort_no'             => 'required|integer',
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.required'             => __('messages.user_id_required'),
            'user_id.integer'              => __('messages.user_id_integer'),
            'user_id.exists'               => __('messages.user_id_exists'),
            'name.required'                => __('messages.name_required'),
            'name.string'                  => __('messages.name_string'),
            'name.max'                     => __('messages.name_max_30'),
            'transaction_type_id.required' => __('messages.transaction_type_id_required'),
            'transaction_type_id.integer'  => __('messages.transaction_type_id_integer'),
            'transaction_type_id.exists'   => __('messages.transaction_type_id_exists'),
            'sort_no.required'             => __('messages.sort_no_required'),
            'sort_no.integer'              => __('messages.sort_no_integer'),
        ];
    }
}
