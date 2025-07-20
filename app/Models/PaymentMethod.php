<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    /** @use HasFactory<\Database\Factories\PaymentMethodFactory> */
    use HasFactory;

    /**
     * 一括代入を許可する属性を指定する
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'transaction_type_id',
        'deleted',
    ];

    /**
     * DBから取得した値やモデルで使用する値を指定した型に自動変換する
     *
     * @return array<string, string>
     */
    protected $casts = [
        'deleted' => 'boolean',
    ];

    // 支払方法削除
    public function delete(): void
    {
        $this->deleted = true;
        $this->save();
    }

    /**
     * 取引タイプとのリレーション
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function transactionType()
    {
        return $this->belongsTo(TransactionType::class);
    }
}
