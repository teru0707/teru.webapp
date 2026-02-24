/* eslint-disable @next/next/no-img-element */
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import dayjs from "dayjs";

import FloatingWidgets from "@/app/_components/FloatingWidgets";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 1. 記事データを取得
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      categories: { include: { category: true } },
    },
  });

  if (!post) {
    notFound();
  }

  // 2. 自動で読了時間を計算
  const plainTextLength = post.content.replace(/<[^>]*>?/gm, "").length;
  const readTime = Math.max(1, Math.ceil(plainTextLength / 500));

  // 3. 関連記事を取得
  const categoryIds = post.categories.map((c) => c.categoryId);
  const relatedPosts = await prisma.post.findMany({
    where: {
      id: { not: post.id },
      categories: { some: { categoryId: { in: categoryIds } } },
    },
    take: 3,
    include: { categories: { include: { category: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-3xl">
      {/* 便利ウィジェット（プログレスバー等） */}
      <FloatingWidgets />

      <div className="mb-8 space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-800">{post.title}</h1>

        <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-slate-500">
          <time>{dayjs(post.createdAt).format("YYYY.MM.DD")}</time>

          <div className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-indigo-600 ring-1 ring-indigo-100">
            {/* 🌟 軽量なSVGアイコンを使用 */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <span>約 {readTime} 分で読めます</span>
          </div>

          <div className="flex gap-2">
            {post.categories.map((c) => (
              <span
                key={c.category.id}
                className="rounded-md bg-white/60 px-3 py-1 ring-1 ring-slate-200"
              >
                {c.category.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-2xl bg-slate-100 shadow-xl ring-1 ring-slate-200/50">
        <img
          src={post.coverImageURL}
          alt={post.title}
          className="h-full w-full object-cover"
        />
      </div>

      <div
        className="space-y-6 rounded-2xl bg-white/60 p-8 text-lg leading-relaxed text-slate-800 shadow-sm ring-1 ring-slate-200/50 backdrop-blur-md"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {relatedPosts.length > 0 && (
        <div className="mt-20 border-t border-slate-200 pt-10">
          <h3 className="mb-8 text-2xl font-bold text-slate-800">
            こちらの記事もおすすめ
          </h3>
          <div className="grid gap-6 sm:grid-cols-3">
            {relatedPosts.map((related) => (
              <Link
                href={`/posts/${related.id}`}
                key={related.id}
                className="group block"
              >
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white/80 backdrop-blur-md transition-all hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                    <img
                      src={`/api/og?title=${encodeURIComponent(related.title)}`}
                      alt={related.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="line-clamp-2 text-sm leading-snug font-bold text-slate-800 transition-colors group-hover:text-indigo-600">
                      {related.title}
                    </h4>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
