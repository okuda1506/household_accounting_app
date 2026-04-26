# アーキテクチャ設計ドキュメント

## 1. 目的

このドキュメントは、KakeiFlow のシステム全体像と責務分離の方針を整理するための高レベル設計書である。

個別機能の詳細仕様は本書ではなく、`docs/features/` 配下の機能別ドキュメントに分離して管理する。

## 2. システム全体像

KakeiFlow は、React + TypeScript による SPA フロントエンドと、Laravel API バックエンドで構成される家計管理アプリである。

```text
Browser
  ├ React SPA
  │  ├ React Router
  │  ├ ThemeContext
  │  ├ Pages / Modals / Charts
  │  └ Axios client
  │
  └ HTTP(S) / JSON
        ↓
Laravel
  ├ routes/web.php
  │   └ SPA エントリーポイントを返却
  ├ routes/api.php
  │   └ 認証付き API / 公開 API を提供
  ├ Controllers
  ├ Form Requests
  ├ Services
  ├ Resources / DTO
  └ Models
        ↓
Data / External Services
  ├ MySQL
  ├ Mail
  ├ Cache
  └ AI Provider (Laravel AI SDK 経由)
```

### 主要構成

| 構成 | 役割 | 主なファイル |
| --- | --- | --- |
| フロントエンド | 画面描画、ルーティング、状態管理、API 呼び出し | `resources/ts/src/App.tsx`, `resources/ts/lib/axios.ts` |
| Web ルート | SPA のエントリーポイント返却 | `routes/web.php` |
| API ルート | 認証・家計管理・AI 機能のエンドポイント定義 | `routes/api.php` |
| バックエンドアプリケーション | バリデーション、業務ロジック、レスポンス整形 | `app/Http`, `app/Services`, `app/Helpers` |
| 永続化・外部連携 | DB、メール送信、AI 呼び出し、キャッシュ | `app/Models`, `app/Mail`, `app/Ai`, `app/Services/Ai` |

## 3. フロントエンド構成

### 3.1 画面構成

- 認証前ページ: サインイン、サインアップ、パスワード再設定、アカウント再開
- 認証後ページ: ダッシュボード、カテゴリ、取引、設定、設定配下の詳細画面
- 共通 UI: ヘッダー、ナビゲーションメニュー、トースト、モーダル、グラフ

### 3.2 ルーティング

- 画面遷移は React Router で管理する
- 認証後ページは `PrivateRoute` により保護する
- `PrivateRoute` は `access_token` の有無だけでなく `/api/user` 呼び出しで有効性も確認する

### 3.3 テーマ管理

- ライト / ダークモードの状態は `ThemeContext` で保持する
- テーマ値は `localStorage` に保存し、`document.documentElement` の `dark` クラスへ反映する

### 3.4 API クライアント

- Axios の `baseURL` は `http://localhost/api`
- `localStorage` の `access_token` を毎リクエスト時に `Authorization: Bearer ...` として送信する
- 401 応答時はトークンを削除し、ログイン画面へリダイレクトする

## 4. バックエンドの責務分離

### 4.1 レイヤ構成

| レイヤ | 主な責務 | 方針 |
| --- | --- | --- |
| Routes | エンドポイント定義、ミドルウェア適用、グルーピング | HTTP の入口だけを定義し、業務ロジックは持たない |
| Form Request | 入力バリデーション、認可判定 | フィールド整合性と入力制約をここに集約する |
| Controller | リクエスト受付、Service 呼び出し、レスポンス返却、例外マッピング | 処理のオーケストレーションに限定する |
| Service | 業務ロジック、集計、状態変更、外部サービス連携 | 画面や HTTP に依存しない処理をまとめる |
| Resource / DTO | 出力整形、レスポンス契約の保証 | API 出力と AI レスポンスの構造を明示する |
| Model | 永続化、リレーション、論理削除 | データ表現と最低限の永続化ルールを担う |

### 4.2 API ルート構成

`routes/api.php` では大きく以下のルート群に分かれている。

| 区分 | 主なエンドポイント | 説明 |
| --- | --- | --- |
| 公開 API | `/register`, `/login`, `/forgot-password`, `/reset-password`, `/reactivate-account` | 認証前に利用する |
| ユーザー設定 API | `/user`, `/user/name`, `/user/password`, `/user/email/*`, `/user/budget`, `/user/ai-advice-mode` | 認証済みユーザー設定 |
| 家計管理 API | `/categories`, `/transactions`, `/payment-methods`, `/dashboard` | 認証済みの家計データ操作 |
| AI API | `/ai-advice` | 認証済みかつレート制限付き |
| アカウント削除 API | `/delete-user` | 認証済みユーザーの削除 |

## 5. 認証・認可設計

### 5.1 認証方式

- Laravel Sanctum による API トークン認証を採用する
- ログイン時に `access_token` を発行し、フロント側で `localStorage` に保存する
- API は `auth:sanctum` ミドルウェアで保護する

### 5.2 認証後の画面保護

- React 側では `PrivateRoute` を利用して認証済みページを保護する
- トークンが存在しても、`/api/user` に失敗した場合は未認証と見なす

### 5.3 ユーザー状態

- `users.deleted` を論理削除フラグとして利用する
- 削除済みユーザーは通常ログイン不可
- 削除済みユーザーに対しては、パスワード再設定フローを利用したアカウント再開を行う

## 6. API 設計方針

### 6.1 成功レスポンス

共通の成功レスポンスは `ApiResponse::success()` で返却する。

```json
{
  "success": true,
  "message": "リクエスト成功",
  "data": {}
}
```

### 6.2 エラーレスポンス

業務エラーやサーバーエラーは `ApiResponse::error()` で返却する。

```json
{
  "success": false,
  "messages": ["エラーメッセージ"],
  "data": null
}
```

### 6.3 バリデーションエラー

- Form Request 由来の 422 は Laravel 標準の `errors` オブジェクトを返すケースがある
- 一部の認証系 API は `data` に項目別エラー、`messages` に平坦化メッセージを返す
- フロント側では `extractFieldErrors` / `extractErrorMessages` により両方の形式を吸収している

### 6.4 今後の整理方針

- 422 のレスポンス形式は将来的に統一対象とする
- ただし現時点では「フロントが正規化して受ける」方針で互換性を保っている

## 7. ドメインモデル

| モデル | 役割 | 主な関連 / 備考 |
| --- | --- | --- |
| `User` | アプリ利用者 | `categories`, `transactions`, `aiCoachingLogs` 相当の起点。`budget`, `deleted`, `ai_advice_mode` を保持 |
| `Transaction` | 家計の入出金記録 | `User`, `Category`, `PaymentMethod`, `TransactionType` に所属 |
| `Category` | 収入 / 支出カテゴリ | ユーザーごとに所有。`sort_no` による表示順を管理 |
| `PaymentMethod` | 支払方法マスタ | `TransactionType` に紐づく補助マスタ |
| `TransactionType` | 収入 / 支出の区分 | Category / Transaction / PaymentMethod の分類基準 |
| `AiCoachingLog` | AI アドバイスの実行ログ | 入力スナップショットと AI 応答を保存 |

### 7.1 論理削除

- `User`, `Transaction`, `Category`, `PaymentMethod` は `deleted` フラグによる論理削除を採用する
- 物理削除ではなく状態変更とすることで、履歴や再開フローとの整合性を保つ

## 8. AI アドバイスのアーキテクチャ

AI アドバイス機能は KakeiFlow の付加価値機能であり、以下の流れで構成される。

1. フロントエンドが `/api/ai-advice` を呼び出す
2. `auth:sanctum` と `throttle:3,1` により認証とレート制限を適用する
3. `AIAdviceController` が `AiGuardService` で利用可否を検証する
4. `AiInputBuilder` が当月支出データを集計し、AI 向け入力 JSON を構築する
5. `SalesCoach` が `resources/prompts/ai_coaching_system.md` をシステムプロンプトとして読み込み、Laravel AI SDK 経由でモデルを呼び出す
6. 応答は `AiAdviceResponseDTO` とその内部 DTO により構造・型を検証する
7. `AiCoachingLogService` が入力値と応答結果を `ai_coaching_logs` に保存する
8. `AiAdviceResource` を通じて API レスポンスとして返却する

### 8.1 AI 入力の基本構造

- `monthly_budget`
- `current_total`
- `remaining_days`
- `projected_monthly_total`
- `category_summary`

### 8.2 AI 応答の基本構造

- `risk_level`
- `analysis`
- `pattern`
- `advice`
- `motivation`

詳細仕様は [docs/features/ai-advice.md](features/ai-advice.md) を参照すること。

## 9. 非機能要件・運用上の方針

### 9.1 セキュリティ

- 認証済み API は `auth:sanctum` で保護する
- パスワード強度は `Password::defaults()` に一元化する
- 削除済みユーザーの通常ログインは禁止する

### 9.2 可用性・障害耐性

- AI 呼び出し失敗時は例外を握りつぶさずログへ記録し、HTTP ステータス付きで返却する
- AI レスポンスは DTO で構造検証し、不正な JSON / 型不整合を早期に検出する

### 9.3 パフォーマンス

- フロントエンドは SPA により画面遷移コストを抑える
- ダッシュボードは「当月サマリ」「過去 6 か月支出推移」「最近 5 件の取引」に集約して描画する
- AI API は 1 分あたり 3 回に制限する

### 9.4 保守性

- UI / API / 業務ロジック / 外部連携を層ごとに分離する
- OpenAPI 定義は `routes/openapi.yaml` で管理する
- 機能別仕様は `docs/features/` に分離し、本書は全体設計に集中させる

## 10. 関連ドキュメント

- [docs/features/password.md](features/password.md)
- [docs/features/budget.md](features/budget.md)
- [docs/features/ai-advice.md](features/ai-advice.md)
- [routes/openapi.yaml](../routes/openapi.yaml)
