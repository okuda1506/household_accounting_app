<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    /** @use HasFactory<\Database\Factories\TransactionFactory> */
    use HasFactory;

    /**
     * 一括代入を許可する属性を指定する
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'transaction_date',
        'transaction_type_id',
        'category_id',
        'amount',
        'payment_method_id',
        'memo',
        'deleted',
    ];

    /**
     * DBから取得した値やモデルで使用する値を指定した型に自動変換する
     *
     * @return array<string, string>
     */
    protected $casts = [
        'transaction_date' => 'datetime',
        'amount' => 'decimal:2',
        'deleted' => 'boolean',
    ];

    /**
     * ユーザーとのリレーション
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * 取引タイプとのリレーション
     */
    public function transactionType()
    {
        return $this->belongsTo(TransactionType::class);
    }

    /**
     * カテゴリとのリレーション
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * 支払方法とのリレーション
     */
    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class);
    }

    // 取引の削除
    public function delete(): void
    {
        $this->deleted = true;
        $this->save();
    }
}
