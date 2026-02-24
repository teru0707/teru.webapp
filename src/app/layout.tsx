import type { Metadata } from "next";
import "./globals.css";

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

import Header from "@/app/_components/Header";
// 🌟 追加: Toaster をインポート
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "NextBlogApp",
  description: "Built to learn Next.js and modern web development.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-slate-50 text-slate-800">
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
        {/* 🌟 追加: アプリ全体でトースト通知を有効化 */}
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}
