<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionType extends Model
{
    /** @use HasFactory<\Database\Factories\TransactionTypeFactory> */
    use HasFactory;

    /**
     * 一括代入を許可する属性を指定する
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
    ];
}
