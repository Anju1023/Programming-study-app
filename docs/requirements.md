# プロジェクト名：Python 学習アプリ（仮）要件定義書 v1.0

## 1. プロジェクト概要

**目的**: 日本語で手軽に学べる、Duolingo/Mimo ライクな Python 学習アプリを開発する。
**ターゲット**: プログラミング初心者の日本人、スマホで隙間時間に学びたい人。
**プラットフォーム**: Web アプリ（PWA 対応でスマホアプリとして利用可能にする）。

## 2. 技術スタック（2026 年最新版選定）

### フロントエンド

- **Framework**: Next.js 16+ (App Router)
  - 最新の React Server Components を活用して爆速表示を目指す。
- **Library**: React 19
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS v4
  - 設定ファイル不要の最新版で開発効率アップ。
  - `framer-motion` を入れて、Duolingo っぽい「正解した時のぷるんとした動き」を作る。
- **Icon**: Lucide React
- **PWA 化**: `next-pwa` または `@ducanh2912/next-pwa`

### Python 実行環境（Core）

- **Engine**: Pyodide (WebAssembly)
  - ブラウザ上で Python ランタイムを動かす。
  - ユーザーが書いたコードをクライアントサイドで即時実行・判定する。セキュリティリスクも低く、サーバー負荷ゼロ。

### バックエンド / インフラ

- **BaaS**: Supabase
  - **Auth**: Google ログイン / メールログイン
  - **Database (PostgreSQL)**: ユーザーデータ、進捗、問題データの管理
  - **Edge Functions**: 必要に応じて複雑な判定処理（今回は基本クライアントで完結させる）

## 3. 機能要件（MVP: Minimum Viable Product）

### 3.1 ユーザー機能

1. **ユーザー登録・認証**
   - ゲスト利用（データ一時保存）と、アカウント作成（データ永続化）の切り替え。
2. **学習マップ（ホーム画面）**
   - ステージ制（例：変数 → データ型 → 条件分岐）。
   - クリアすると次が解放されるロック機能。

### 3.2 学習・クイズ機能

1. **多形式クイズ**
   - **選択問題**: コードの実行結果を当てる。
   - **並べ替え問題**: バラバラのコードブロックを正しい順序にする（スマホで打ち込む手間を省くため重要！）。
   - **穴埋め問題**: 一部が空欄になったコードを完成させる。
   - **コード入力**: 実際に短いコードを書いて実行する（Pyodide で判定）。
2. **フィードバック**
   - 正解時：褒めるエフェクトと XP（経験値）獲得。
   - 不正解時：ライフ（ハート）減少。解説の表示。

### 3.3 ゲーミフィケーション

1. **ハート（ライフ）システム**
   - 間違えると減る。時間経過または広告/課金（将来的に）で回復。
2. **連続記録（ストリーク）**
   - 毎日の学習継続を可視化。
3. **XP・ランキング**
   - 週間ランキングの実装。

## 4. データベース設計（Supabase Schema 案）

### `users` テーブル

- `id`: UUID (PK)
- `email`: String
- `display_name`: String
- `avatar_url`: String
- `xp_total`: Integer
- `streak_count`: Integer
- `hearts`: Integer (Default: 5)
- `last_study_date`: Timestamp

### `courses` テーブル（今回は Python のみだが拡張性を持たせる）

- `id`: UUID (PK)
- `title`: String ("Python 基礎"など)
- `description`: Text

### `units` テーブル（章）

- `id`: UUID (PK)
- `course_id`: FK
- `order`: Integer (表示順)
- `title`: String ("変数を使いこなそう")

### `lessons` テーブル（各マス）

- `id`: UUID (PK)
- `unit_id`: FK
- `order`: Integer
- `type`: String ("lecture", "quiz", "boss")

### `user_progress` テーブル

- `user_id`: FK
- `lesson_id`: FK
- `status`: String ("completed", "locked")
- `completed_at`: Timestamp

## 5. UI/UX デザイン指針

- **モバイルファースト**: PC ビューはスマホ画面を中央に表示する形式でも OK。
- **直感的な操作**: キーボード入力を極力減らし、タップ操作メインにする。
- **親しみやすさ**: 角丸強めのデザイン、ポップな配色、ENFP 的な元気なトーン！

## 6. 開発ロードマップ（初期フェーズ）

1. **Environment**: Next.js + Supabase のセットアップ。
2. **Core**: Pyodide を Next.js で動かして `print("Hello")` させる。
3. **Data**: 問題データを JSON または DB に入れる。
4. **UI**: クイズ画面のコンポーネント作成。
5. **Logic**: 正誤判定ロジックの実装。
