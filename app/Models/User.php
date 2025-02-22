<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * 一括代入を許可する属性を指定する
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'deleted',
    ];

    /**
     * JSONシリアライズ時に隠す属性を指定する
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * DBから取得した値やモデルで使用する値を指定した型に自動変換する
     *
     * @return array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'deleted' => 'boolean',
    ];

    /**
     * ユーザーが持つカテゴリとのリレーション
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function categories()
    {
        return $this->hasMany(Category::class);
    }

    /**
     * ユーザーが所有する取引
     */
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    // ユーザー削除
    public function delete(): void
    {
        $this->deleted = true;
        $this->save();
    }
}
