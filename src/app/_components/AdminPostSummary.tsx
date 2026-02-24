"use client";
import type { Post } from "@/app/_types/Post";
import dayjs from "dayjs";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// 🌟 faEye (目のアイコン) を追加
import { faPen, faTrash, faEye } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

type Props = {
  post: Post;
  reloadAction: () => Promise<void>;
};

const AdminPostSummary: React.FC<Props> = ({ post, reloadAction }) => {
  const dtFmt = "YYYY.MM.DD HH:mm";

  const handleDelete = async () => {
    if (
      !window.confirm(
        `記事「${post.title}」を本当に削除しますか？\nこの操作は取り消せません。`,
      )
    ) {
      return;
    }

    const deletePromise = fetch(`/api/admin/posts/${post.id}`, {
      method: "DELETE",
      cache: "no-store",
    }).then(async (res) => {
      if (!res.ok) throw new Error("削除に失敗しました");
      await reloadAction();
    });

    await toast.promise(deletePromise, {
      loading: "削除しています...",
      success: "記事を削除しました🗑️",
      error: "削除に失敗しました",
    });
  };

  return (
    <div className="group flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md sm:flex-row sm:items-center">
      <div className="flex-1">
        <div className="mb-2 text-xs font-bold tracking-wider text-slate-400">
          {dayjs(post.createdAt).format(dtFmt)}
        </div>
        <h2 className="text-lg font-bold text-slate-800 transition-colors group-hover:text-indigo-600">
          {post.title}
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {post.categories.map((c) => (
            <span
              key={c.id}
              className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"
            >
              {c.name}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 sm:pl-4">
        {/* 🌟 新規追加：実際の記事ページ（読者が見る画面）へ飛ぶボタン */}
        <Link href={`/posts/${post.id}`} target="_blank">
          <button className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-600 transition-all hover:scale-105 hover:bg-emerald-100">
            <FontAwesomeIcon icon={faEye} />
            プレビュー
          </button>
        </Link>

        {/* 編集画面へ飛ぶボタン */}
        <Link href={`/admin/posts/${post.id}`}>
          <button className="flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-600 transition-all hover:scale-105 hover:bg-indigo-100">
            <FontAwesomeIcon icon={faPen} />
            編集
          </button>
        </Link>

        <button
          onClick={handleDelete}
          className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition-all hover:scale-105 hover:bg-red-100"
        >
          <FontAwesomeIcon icon={faTrash} />
          削除
        </button>
      </div>
    </div>
  );
};

export default AdminPostSummary;
