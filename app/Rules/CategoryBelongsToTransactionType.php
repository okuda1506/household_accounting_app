<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use App\Models\Category;

class CategoryBelongsToTransactionType implements ValidationRule
{
    protected $transactionTypeId;

    /**
     * Create a new rule instance.
     *
     * @param int $transactionTypeId
     */
    public function __construct(int $transactionTypeId)
    {
        $this->transactionTypeId = $transactionTypeId;
    }

    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // todo: transaction_type_idに紐づいたcategory_idであるか
        $isValid = Category::where('id', $value)
            ->where('transaction_type_id', $this->transactionTypeId)
            ->exists();

        if (!$isValid) {
            $fail(__('messages.invalid_category_for_transaction_type'));
        }
    }
}
