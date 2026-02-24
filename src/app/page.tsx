// src/app/page.tsx (Server Component)
import { prisma } from "@/lib/prisma";
import PostSummary from "@/app/_components/PostSummary";
import Link from "next/link";
import { BlogUtils } from "@/lib/BlogUtils";

// ISR: 60秒ごとにページを再生成（キャッシュ戦略）
export const revalidate = 60;

export default async function Page() {
  // サーバー側で直接データベースから取得（超高速）
  const posts = await prisma.post.findMany({
    include: {
      categories: { include: { category: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // BlogUtils で読了時間を付与
  const processedPosts = BlogUtils.processPosts(
    posts.map((p) => ({
      id: p.id,
      title: p.title,
      content: p.content,
      createdAt: p.createdAt.toISOString(),
      coverImage: { url: p.coverImageURL, width: 1000, height: 1000 },
      categories: p.categories.map((c) => ({
        id: c.category.id,
        name: c.category.name,
      })),
    })),
  );

  return (
    <main className="space-y-8 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          Latest Posts
        </h1>
        <Link
          href="/admin/posts"
          className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition-all hover:scale-105 hover:bg-slate-800"
        >
          管理者機能 🔑
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {processedPosts.map((post) => (
          <PostSummary key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
}
