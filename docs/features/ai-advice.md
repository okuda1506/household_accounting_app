# AI アドバイス仕様

## 1. 目的

AI アドバイス機能は、当月の支出状況と予算設定をもとに、ユーザーへ実行可能な改善提案を返す機能である。

単なるコメント生成ではなく、予算超過リスクの判定、問題カテゴリの特定、今日できる行動提案までを一連のフローとして扱う。

## 2. 関連エンドポイント

| エンドポイント | 用途 |
| --- | --- |
| `GET /api/ai-advice` | AI アドバイスを取得 |
| `PUT /api/user/ai-advice-mode` | AI アドバイスモードの ON / OFF 切替 |

`GET /api/ai-advice` には以下のミドルウェアを適用する。

- `auth:sanctum`
- `throttle:3,1`

## 3. 利用条件

AI アドバイスは以下の条件を満たす場合のみ利用可能とする。

- ユーザーが認証済みであること
- `budget > 0` であること
- `ai_advice_mode = true` であること

`AiGuardService` はこれらの条件を検証し、不正な利用を防ぐ。

## 4. 入力データ生成

AI へ渡す入力は `AiInputBuilder` が生成する。

### 入力項目

| 項目 | 説明 |
| --- | --- |
| `monthly_budget` | 月間予算 |
| `current_total` | 当月累計支出 |
| `remaining_days` | 月末までの残日数 |
| `projected_monthly_total` | 現在の支出ペースから算出した月末予測支出 |
| `category_summary` | カテゴリ別支出合計と件数 |

### データ取得方針

- 対象は当月の支出取引のみ
- `transaction_type_id = EXPENSE`
- `deleted = false`
- カテゴリ未設定時は `未分類` として集約する

## 5. AI 呼び出しフロー

1. フロントエンドが `/api/ai-advice` を実行
2. `AIAdviceController` が `AiGuardService` で利用条件を確認
3. `AiAdviceService` が `AiInputBuilder` から入力 JSON を生成
4. `SalesCoach` が `resources/prompts/ai_coaching_system.md` を読み込み、Laravel AI SDK 経由でモデルを呼び出す
5. 応答文字列を JSON として decode する
6. `AiAdviceResponseDTO` / `AnalysisDTO` / `AdviceDTO` / `RiskLevel` で構造と型を検証する
7. `AiCoachingLogService` が入力値と結果を `ai_coaching_logs` へ永続化する
8. `AiAdviceResource` を通じて API レスポンスへ変換する

## 6. AI 応答契約

### 6.1 期待するトップレベル構造

| 項目 | 型 | 説明 |
| --- | --- | --- |
| `risk_level` | string | `safe / warning / danger` |
| `analysis` | object | 分析結果 |
| `pattern` | string | 支出傾向の識別子 |
| `advice` | object | 実行アクション |
| `motivation` | string | 前向きな一言 |

### 6.2 `analysis`

| 項目 | 型 | 説明 |
| --- | --- | --- |
| `budget_gap` | int | 予算との差分 |
| `daily_safe_limit` | int | 安全圏の 1 日あたり支出目安 |
| `main_issue_category` | string | 問題となる主カテゴリ |
| `analysis_reason` | string | 判定理由 |

### 6.3 `advice`

| 項目 | 型 | 説明 |
| --- | --- | --- |
| `micro_action` | string | 今日できる具体的行動 |
| `daily_budget_target` | int | 今日の目標支出額 |
| `focus_category` | string | 注視カテゴリ |

## 7. プロンプト設計方針

`resources/prompts/ai_coaching_system.md` に AI へのシステム指示を定義する。

主な方針は以下のとおり。

- 出力は JSON のみ
- 数値項目は必ず数値型で返す
- 固定費を主原因にせず、行動で改善可能なカテゴリを優先する
- `micro_action` は短く、今日実行できる具体的行動に限定する

## 8. ログ保存

AI アドバイス実行時には `ai_coaching_logs` に以下を保存する。

- AI 入力のスナップショット
- リスクレベル
- 分析結果
- 提案内容
- モチベーション文

これにより、将来的な監査、分析、プロンプト改善の基礎データを残せる。

## 9. エラーハンドリング

- 予算未設定や AI モード無効時は 403 系エラーで返す
- AI 応答が JSON でない場合は `RuntimeException`
- 必須キー不足や型不整合は DTO 生成時に `InvalidArgumentException`
- 例外は Controller でログ出力し、API エラーレスポンスへ変換する

## 10. 設計上の意図

- AI を「自由回答」ではなく「型付きの業務機能」として扱う
- 入力整形、ガード、DTO 検証、ログ保存を明示的に分離し、信頼性を確保する
- 家計アプリにおける AI の価値を、感想生成ではなく具体的な行動提案へ寄せる
