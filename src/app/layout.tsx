import type { Metadata } from "next";
import "./globals.css";

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

import Header from "@/app/_components/Header";
import { Toaster } from "react-hot-toast"; // 🌟 トースト通知をインポート

export const metadata: Metadata = {
  title: "NextBlogApp",
  description: "Built to learn Next.js and modern web development.",
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="ja">
      {/* 選択時のハイライト色をオシャレなインディゴに変更 */}
      <body className="selection:bg-indigo-200 selection:text-indigo-900">
        <Header />
        {/* コンテンツの幅を少し広げ、余白をリッチに取る */}
        <main className="mx-auto max-w-5xl px-6 py-12">{children}</main>

        {/* 🌟 アプリ全体でトースト通知を有効化 */}
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}
