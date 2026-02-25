# SalesCoach 使用ガイド（Laravel AI SDK）

## 概要

- `SalesCoach` は Laravel AI SDK の `Promptable` トレイトを利用した Agent
  クラス\
- SalesCoach を使って簡単に AI（今回の例では
  Gemini）へプロンプトを送信できる\
  ※ Laravel 12.x, PHP8.4 以上で動作。

---

## 基本的な使い方

Artisan コマンドを使用してエージェントを作成。

```sh
php artisan make:agent SalesCoach
```

使用例:

```php
use App\Ai\Agents\SalesCoach;

$salesCoach = new SalesCoach();
$response = $salesCoach->prompt('newjeansでおすすめの曲は？');
```

`prompt()` は `Laravel\Ai\Responses\AgentResponse` を返す

---

## AgentResponse の構造

`$response` の結果から、主に以下のプロパティが利用可能。

### 1. \$response-\>text

最もよく使うプロパティ。\
AIが生成した最終テキスト。

```php
echo $response->text;
```

---

### 2. \$response-\>messages

会話履歴（Collection）。

- UserMessage
- AssistantMessage

などが含まれる。

```php
$response->messages;
```

---

### 3. \$response-\>usage

トークン使用量情報。

- promptTokens
- completionTokens
- reasoningTokens

```php
$response->usage->promptTokens;
$response->usage->completionTokens;
```

コスト分析やログ用途に使える。

---

### 4. \$response-\>meta

使用プロバイダ・モデル情報。

```php
$response->meta->provider; // gemini
$response->meta->model;    // gemini-3-flash-preview
```

---

## Promptable トレイトの主要メソッド

SalesCoach は `Promptable` を使用しているため、以下が利用可能。

### prompt()

通常の同期呼び出し。

```php
$response = $salesCoach->prompt('質問内容');
```

---

### stream()

ストリーミング応答を取得。

```php
$response = $salesCoach->stream('質問内容');
```

---

### queue()

ジョブとして非同期実行。

```php
$response = $salesCoach->queue('質問内容');
```

---

### broadcast()

ストリーム結果をブロードキャスト可能。

---

## Controllerでの推奨実装例

```php
public function aiAdvice(Request $request)
{
    $salesCoach = new SalesCoach();

    $response = $salesCoach->prompt('分析してください');

    return response()->json([
        'analysis' => $response->text,
        'usage' => [
            'prompt_tokens' => $response->usage->promptTokens,
            'completion_tokens' => $response->usage->completionTokens,
        ],
        'meta' => [
            'provider' => $response->meta->provider,
            'model' => $response->meta->model,
        ]
    ]);
}
```

---

## 重要ポイント

- 基本的には `$response->text` を使えばOK
- トークン使用量は `$response->usage`
- モデル情報は `$response->meta`
- 高度な用途では `stream()` や `queue()` を使用

---

## 今後の拡張

- 分析用データを組み込んだプロンプト生成
- JSON形式での出力制御
- モデル指定・フェイルオーバー活用
- タイムアウト制御

---

## まとめ

SalesCoach は以下の流れで使用する：

1.  インスタンス生成
2.  `prompt()` 実行
3.  `$response->text` を取得
4.  必要なら usage / meta を活用
