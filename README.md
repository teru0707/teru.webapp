# Next.js ブログアプリケーション

このプロジェクトは、Next.js、TypeScript、および Prisma を用いて構築されたモダンなブログアプリケーションです。

## 主な機能

- **ブログ記事の閲覧**: 投稿された記事を一覧および詳細ページで閲覧できます。
- **管理者機能**: 記事の作成、編集、削除、およびカテゴリの管理が可能です。
- **デザインのこだわり**:
  - Tailwind CSS を活用したモダンなインターフェース。
  - ガラス質感（Glassmorphism）を取り入れたカードデザインや、洗練されたヘッダー。
- **便利機能**:
  - **読了時間の表示**: 記事のボリュームに合わせて、読み終えるまでの目安時間を自動計算して表示します。
- **Java風のロジック実装**: TypeScript 環境でありながら、Java の静的メソッドやストリーム操作の考え方を取り入れたユーティリティクラスを一部に実装しています。

## 使用技術 (Tech Stack)

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS
- **Database**: Prisma (ORM), SQLite
- **Icons**: FontAwesome
- **Date Handling**: dayjs

## 開発の始め方

まず、依存関係をインストールし、開発サーバーを起動します。

```bash
npm install
npm run dev
# または
yarn dev
```
