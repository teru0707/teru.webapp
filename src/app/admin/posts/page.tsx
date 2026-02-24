"use client";
import { useState, useEffect, useCallback } from "react";
import type { Post } from "@/app/_types/Post";
import type { PostApiResponse } from "@/app/_types/PostApiResponse";
import Link from "next/link";
import AdminPostSummary from "@/app/_components/AdminPostSummary";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faPlus } from "@fortawesome/free-solid-svg-icons";

const Page: React.FC = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // 🌟 削除: toastを使うので、isSubmittingのstateはもう不要！

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch("/api/posts", {
        method: "GET",
        cache: "no-store",
      });
      if (!response.ok) throw new Error("データの取得に失敗しました");

      const postResponse: PostApiResponse[] = await response.json();
      setPosts(
        postResponse.map((rawPost) => ({
          id: rawPost.id,
          title: rawPost.title,
          content: rawPost.content,
          coverImage: { url: rawPost.coverImageURL, width: 1000, height: 1000 },
          createdAt: rawPost.createdAt,
          categories: rawPost.categories.map((c) => ({
            id: c.category.id,
            name: c.category.name,
          })),
        })),
      );
    } catch (e) {
      setFetchError(
        e instanceof Error ? e.message : "予期せぬエラーが発生しました",
      );
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (fetchError)
    return <div className="font-bold text-red-500">{fetchError}</div>;

  if (!posts) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-slate-500">
        <FontAwesomeIcon
          icon={faSpinner}
          className="mr-2 animate-spin text-2xl text-indigo-500"
        />
        <span className="font-bold tracking-wider">Loading Posts...</span>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-4xl">
      <div className="mb-8 flex items-center justify-between border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-800">
          投稿記事の管理
        </h1>
        <Link href="/admin/posts/new">
          <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg">
            <FontAwesomeIcon icon={faPlus} />
            新規作成
          </button>
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-slate-200 py-20 text-center text-slate-500">
          記事がありません。「新規作成」から最初の記事を書いてみましょう！
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <AdminPostSummary
              key={post.id}
              post={post}
              reloadAction={fetchPosts} // 🌟 不要になった setIsSubmitting を削除し、fetchPosts を直接渡す
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default Page;
