# 基本設計書 (Design Document)

## 1. アーキテクチャ概要

**"Client-side Intelligence, Server-side Persistence"**

本アプリケーションは、Next.js (App Router) をベースとした Web アプリケーションであり、Python コードの実行という重い処理をクライアントサイド (WebAssembly / Pyodide) にオフロードすることで、サーバーコストを最小限に抑えつつ、高速なインタラクションを実現する。

### 1.1 ハイレベル構成図

```mermaid
graph TD
    User[User (Mobile/Desktop)] -->|HTTPS| CDN[Vercel Edge Network]
    CDN -->|Next.js App Router| Server[Next.js Server (Vercel)]

    subgraph Client [Browser / PWA]
        UI[React UI (Client Components)]
        PyWorker[Web Worker (Pyodide)]
        LocalDB[IndexedDB / Cache API]
    end

    subgraph Backend [Supabase]
        Auth[Auth Service]
        DB[(PostgreSQL)]
        Storage[Storage]
    end

    User -->|Interaction| UI
    UI -->|Async Message| PyWorker
    UI -->|Server Actions| Server
    Server -->|SQL| DB
    UI -->|Supabase SDK| Auth
```

## 2. ディレクトリ構成 (Next.js App Router)

```text
src/
├── app/
│   ├── (auth)/             # 認証関連ルート (login, register)
│   ├── (dashboard)/        # 学習メイン画面 (protected)
│   │   ├── learn/          # ステージマップ
│   │   ├── lesson/[id]/    # レッスン実行画面
│   │   └── profile/        # ユーザー設定
│   ├── api/                # Route Handlers (必要に応じて)
│   ├── globals.css         # Tailwind v4 imports & theme
│   ├── layout.tsx          # Root Layout (PWA setup, Providers)
│   └── page.tsx            # LP
├── components/
│   ├── ui/                 # 汎用 UI コンポーネント (Button, Card...)
│   ├── learn/              # 学習画面特有のコンポーネント (Map, Unit...)
│   ├── quiz/               # クイズ用コンポーネント (Editor, Sortable...)
│   └── layout/             # Header, BottomNav...
├── lib/
│   ├── supabase/           # Supabase Client (SSR/Browser)
│   ├── pyodide/            # Pyodide 関連ユーティリティ
│   └── utils.ts            # 汎用関数
├── hooks/
│   ├── use-pyodide.ts      # Pyodide Worker との通信フック
│   └── use-auth.ts         # ユーザー認証状態フック
├── workers/
│   └── python.worker.ts    # Pyodide 実行用 Web Worker
├── types/                  # TypeScript 型定義
└── styles/                 # 追加のスタイル (基本は Tailwind)
```

## 3. 技術スタック詳細設計

### 3.1 Frontend: Next.js 16 + React 19

- **Rendering Strategy**:
  - 基本は **RSC (React Server Components)** で静的コンテンツや初期データを配信。
  - クイズ画面やインタラクティブな部分は `"use client"` を使用。
  - **React Actions**: データの更新（進捗保存など）は Server Actions (`useActionState`, `useOptimistic`) で実装し、API エンドポイントを減らす。
- **Styling: Tailwind CSS v4**:
  - `postcss.config.mjs` と `@tailwindcss/postcss` を使用。
  - 設定は CSS 変数ベース (`@theme`) で行い、`tailwind.config.js` は極力使用しない。
  - アニメーションは `framer-motion` (v12+) を使用し、Layout Animations でリッチな体験を提供。

### 3.2 Python Runtime: Pyodide (WebAssembly)

- **Execution Model**:
  - **Web Worker**: メインスレッドのブロックを防ぐため、Pyodide は必ず Web Worker 内で実行する。
  - **Comlink**: Worker との通信を型安全かつ簡単に行うために `comlink` ライブラリなどの導入を検討（またはネイティブの `postMessage` を型付けしてラップ）。
- **Loading Strategy**:
  - 初回ロード時は Pyodide を読み込まず、学習開始ボタン等のトリガー、または `requestIdleCallback` で遅延読み込み (Lazy Loading) する。
  - 必要なパッケージ (`micropip` 等) のみ動的にロード。

### 3.3 Backend: Supabase

- **Authentication**:
  - `@supabase/ssr` を使用。
  - Cookie ベースのセッション管理。
  - Next.js Middleware で保護されたルートへのアクセス制御を行う。
- **Database Access**:
  - Server Components からは `createServerClient` で直接 DB アクセス。
  - RLS (Row Level Security) ポリシーでセキュリティを担保。

### 3.4 PWA (Progressive Web App)

- **Library**: `@serwist/next` (または `@ducanh2912/next-pwa`)
  - **Service Worker**: オフラインキャッシュ（App Shell, Pyodide バイナリ, 問題データ）。
  - **Manifest**: `app/manifest.ts` で動的に生成。

## 4. データモデル設計 (Schema Refinement)

### `profiles` (extends `auth.users`)

Supabase Auth の `users` テーブルと 1:1 で紐づく公開プロフィール情報。

| Column           | Type          | Description                    |
| :--------------- | :------------ | :----------------------------- |
| `id`             | `uuid`        | PK, references `auth.users.id` |
| `username`       | `text`        | unique, 表示名                 |
| `avatar_url`     | `text`        |                                |
| `xp`             | `int`         | default 0                      |
| `streak`         | `int`         | default 0                      |
| `hearts`         | `int`         | default 5                      |
| `last_active_at` | `timestamptz` |                                |

### `courses`, `units`, `lessons`

学習コンテンツの階層構造。

- **Courses**: "Python Basic"
- **Units**: "Variables", "Loops" (Courses の子)
- **Lessons**: 個々のクイズセット (Units の子)

### `user_progress`

ユーザーの学習進捗。

| Column         | Type          | Description                     |
| :------------- | :------------ | :------------------------------ |
| `user_id`      | `uuid`        | PK, FK to profiles              |
| `lesson_id`    | `uuid`        | PK, FK to lessons               |
| `status`       | `enum`        | 'locked', 'active', 'completed' |
| `score`        | `int`         | クイズのスコア                  |
| `completed_at` | `timestamptz` |                                 |

## 5. UI/UX デザインシステム

- **Color Palette**:
  - Primary: `#58CC02` (Green - Success/Go) -> Tailwind: `green-500`
  - Secondary: `#1CB0F6` (Blue - Info/Neutral) -> Tailwind: `sky-500`
  - Accent: `#FFC800` (Yellow - Highlight/XP) -> Tailwind: `yellow-400`
  - Danger: `#FF4B4B` (Red - Error/Heart loss) -> Tailwind: `red-500`
  - Surface: `#FFFFFF` / `#F7F7F7` (Background)
- **Typography**:
  - 日本語: `Noto Sans JP` (Google Fonts)
  - コード: `Fira Code` or `Geist Mono`
- **Components Style**:
  - **Buttons**: "Pushable" 3D button style (border-b-4).
  - **Cards**: 大きな角丸 (rounded-2xl, rounded-3xl)。
  - **Motion**: 正解時の弾むアニメーション、XP 獲得時のパーティクル。

## 6. 開発フロー (Step-by-Step)

1.  **Project Setup**:
    - Next.js + Tailwind v4 + Supabase setup.
    - Linter / Formatter (Biome or ESLint+Prettier).
2.  **Core Feature (Spike)**:
    - Pyodide Web Worker の実装と、React からの簡単なコード実行確認。
3.  **UI Implementation**:
    - Layout (Mobile Frame).
    - Components (Button, CodeEditor).
4.  **Data & Logic**:
    - Supabase Table 作成。
    - Mock データでの学習フロー実装。
5.  **Integration**:
    - Pyodide とクイズ UI の結合。
    - 正誤判定ロジックの実装。
6.  **Polish**:
    - Animation, Sound, PWA 設定。
