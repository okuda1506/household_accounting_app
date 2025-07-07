<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    /** @use HasFactory<\Database\Factories\CategoryFactory> */
    use HasFactory;

    /**
     * 一括代入を許可する属性を指定する
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'transaction_type_id',
        'sort_no',
    ];

    /**
     * DBから取得した値やモデルで使用する値を指定した型に自動変換する
     *
     * @return array<string, string>
     */
    protected $casts = [
        'deleted' => 'boolean',
    ];

    /**
     * ユーザーとのリレーション
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
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

    // カテゴリの論理削除
    public function delete(): void
    {
        $this->deleted = true;
        $this->save();
    }
}
