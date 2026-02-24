# Next.js Modern Blog 🚀

最新のWeb技術（Next.js 15 App Router, Prisma, Tailwind CSS v4, Framer Motion）をフル活用して構築された、プロ品質のフルスタックブログアプリケーションです。
一流のSaaSアプリを彷彿とさせる洗練されたUI/UXと、React Server Components (RSC) による圧倒的な表示速度を両立しています。

## 📸 スクリーンショット

> **💡 画像の配置について**
> プロジェクトの `public` フォルダ内に `screenshots` という名前のフォルダを作成し、以下のファイル名で画像を配置すると自動的に表示されます。

### 1. 豪華なメッシュグラデーションとトップページ

![トップページ](./public/screenshots/1-top.png)

### 2. 爆速のリアルタイム・インクリメンタル検索

![リアルタイム検索](./public/screenshots/2-search.png)

### 3. 記事詳細（自動読了時間・虹色プログレスバー・シェアボタン）

![記事詳細](./public/screenshots/3-article.png)

### 4. 関連記事の自動レコメンドと動的OGPサムネイル

![関連記事とOGP](./public/screenshots/4-related.png)

### 5. Zodによる強固なバリデーションとiOS風トグルを備えた管理画面

![管理画面](./public/screenshots/5-admin.png)

---

## ✨ 主な機能 (Features)

### 🎨 圧倒的なUI/UX (Frontend)

- **動的メッシュグラデーション**: CSSアニメーションを駆使し、スクロールに追従するリッチでフワフワと動く背景。
- **Framer Motion アニメーション**: ページ遷移、ホバー時のカード浮き上がり、検索時の要素の並び替え（`AnimatePresence`）など、滑らかなマイクロインタラクション。
- **読者サポート機能**: 記事の純粋な文字数から「約○分で読めます」を自動計算。スクロールに連動するトップのプログレスバーと、ワンクリックでURLをコピーできる追従型アクションボタン（FAB）を搭載。

### ⚡️ パフォーマンスとSEO (Architecture)

- **React Server Components (RSC)**: 記事の取得などをサーバー側で完結させ、クライアントへのJS送信量を極限まで削減。ローディングスピナー不要の爆速表示を実現。
- **動的OGP画像生成 (`next/og`)**: 記事タイトルを含んだ高品質なサムネイル画像を、Edge環境上でリアルタイムかつ高速に自動生成。
- **インクリメンタル検索**: 記事タイトルとカテゴリタグを対象に、キーボードを叩いた瞬間にフワッと画面が切り替わるリアルタイム検索。

### 🛡️ 堅牢なバックエンドと管理機能 (Backend & Admin)

- **Prisma + PostgreSQL**: 型安全で直感的なORMによる強力なデータベース操作。関連記事の抽出もリレーションを使って解決。
- **React Hook Form + Zod**: 管理画面の投稿・編集フォームにおける複雑なバリデーション（文字数、URL形式、必須チェック）を完全に型安全な状態で実装。
- **公開 / 下書きステータス管理**: iOSライクなトグルスイッチで、記事の公開状態を直感的にコントロール可能。
- **スタイリッシュなトースト通知**: `react-hot-toast` を導入し、データ保存や削除時の結果を画面上部に美しくポップアップ。

---

## 🛠 技術スタック (Tech Stack)

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/) / [Prisma](https://www.prisma.io/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Form & Validation**: [React Hook Form](https://react-hook-form.com/) / [Zod](https://zod.dev/)
- **UI Components & Icons**: [FontAwesome](https://fontawesome.com/), `react-hot-toast`

---

## 💻 ローカルでの起動方法 (Getting Started)

### 1. リポジトリのクローン

```bash
git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
cd your-repo-name

```

### 2. パッケージのインストール

```bash
npm install

```

### 3. 環境変数の設定

プロジェクトのルートに .env ファイルを作成し、PostgreSQLの接続文字列を設定してください。

```コードスニペット
DATABASE_URL="postgresql://user:password@localhost:5432/your_db_name"

```

### 4. データベースのセットアップ (Prisma)

```bash
npx prisma db push
npx prisma generate

```

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 にアクセスするとアプリが立ち上がります。

💡 今後の展望 (Roadmap)
[ ] 管理者画面への認証機能の追加（NextAuth / Auth.js）

[ ] 記事作成エディタのリッチテキスト化（TipTap / MDX対応）

[ ] 画像アップロード機能（ドラッグ＆ドロップ対応）の実装

[ ] ダークモード（Dark Theme）の完全対応

🚀 デプロイについて (Deployment)
このアプリケーションは Vercel へのデプロイに最適化されています。
Edge Runtimeを活用した動的OGP生成（next/og）や、Server Componentsの恩恵を最大限に受けるため、本番環境の構築には Vercel × 外部PostgreSQL（Supabaseなど）の組み合わせを推奨します。

Next Step
この素晴らしいアプリを世界中に公開するために、VercelとSupabaseを使ったデプロイの手順に進みましょうか？
