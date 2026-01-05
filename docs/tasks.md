# 開発タスクリスト

このファイルはプロジェクトの進捗を管理するために使用します。
作業を開始する前に該当タスクを確認し、完了したらチェックを入れてください。

## Phase 1: プロジェクト初期化と環境構築 🏗️

- [x] **Next.js プロジェクト作成**
- [x] **Tailwind CSS v4 導入**
- [x] **Lint & Format 設定**
- [x] **ディレクトリ構成の整備**
- [x] **Supabase プロジェクト準備**
- [x] **Git 初期化**

## Phase 2: Core 機能検証 (Pyodide & Worker) 🐍

- [x] **Pyodide 環境構築**
- [x] **React Hook 作成**
- [x] **プロトタイプ画面作成**
- [x] **動作検証**

## Phase 3: 認証とデータベース 🔐

- [x] **Supabase Auth セットアップ**
  - `@supabase/ssr` インストール
  - Middleware 実装 (セッション管理)
  - ログイン/登録ページ作成 (`app/(auth)/login`)
- [x] **データベース設計と適用**
  - `profiles` テーブル作成 (SQL)
  - `courses`, `units`, `lessons` テーブル作成
  - `user_progress` テーブル作成

## Phase 4: UI コンポーネントとデザインシステム 🎨

- [ ] **Tailwind v4 テーマ設定**
  - カラーパレット定義 (Green, Blue, Yellow, Red)
  - フォント設定 (Noto Sans JP, Monospace)
- [ ] **共通コンポーネント実装**
  - `Button` (3D style)
  - `Card`
  - `ProgressBar`
- [ ] **レイアウト実装**
  - モバイル用フレームレイアウト
  - ボトムナビゲーション (`app/(dashboard)/layout.tsx`)
- [ ] **アニメーション導入**
  - `framer-motion` インストール
  - インタラクションの動きテスト

## Phase 5: 学習機能実装 (Main Features) 📚

- [ ] **学習マップ (ホーム画面)**
  - ステージ/ユニットのリスト表示
  - ロック/アンロック状態の可視化
- [ ] **クイズ実行画面**
  - クイズコンテナ (`app/(dashboard)/lesson/[id]/page.tsx`)
  - **問題タイプ別コンポーネント**
    - [ ] 選択問題 (Multiple Choice)
    - [ ] 並べ替え問題 (Parsons Problem)
    - [ ] 穴埋め/コード入力
- [ ] **正誤判定ロジック**
  - クライアントサイドでの判定処理
  - Pyodide を使った出力一致判定
- [ ] **結果画面 (Result)**
  - クリア演出 (XP 獲得, 褒めるメッセージ)

## Phase 6: ゲーミフィケーションと仕上げ 🏆

- [ ] **進捗保存処理**
  - Server Actions で `user_progress` 更新
  - XP, Streak, Hearts の更新ロジック
- [ ] **PWA 化**
  - `@serwist/next` 導入
  - `app/manifest.ts` 作成
  - オフライン動作確認
- [ ] **パフォーマンス最適化**
  - Lazy Loading (Pyodide)
  - Bundle Size 確認
- [ ] **エラーハンドリングと UX 向上**
  - ローディング表示 (Skeletons)
  - エラーバウンダリ設定

## Phase 7: デプロイとテスト 🚀

- [ ] **デプロイ設定**
  - Vercel へのデプロイ
  - 環境変数設定 (Production)
- [ ] **最終確認**
  - スマホ実機での動作確認
  - Lighthouse スコア計測
