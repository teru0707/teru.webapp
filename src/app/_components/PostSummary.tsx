// src/app/_components/PostSummary.tsx
"use client";
import type { Post } from "@/app/_types/Post";
import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

type Props = {
  post: Post;
};

const PostSummary: React.FC<Props> = ({ post }) => {
  const dtFmt = "YYYY.MM.DD";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5 }}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-xl"
    >
      <Link href={`/posts/${post.id}`} className="flex h-full flex-col">
        {/* サムネイル画像（アスペクト比固定で美しく） */}
        <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
          <Image
            src={post.coverImage.url}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-1 flex-col p-5">
          {/* メタ情報 */}
          <div className="mb-3 flex items-center justify-between text-xs font-medium text-slate-500">
            <time dateTime={post.createdAt}>
              {dayjs(post.createdAt).format(dtFmt)}
            </time>
            <span className="flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-indigo-600">
              ⏱ {post.readingTime} min read
            </span>
          </div>

          {/* タイトル */}
          <h2 className="mb-3 line-clamp-2 text-xl leading-snug font-bold text-slate-900 group-hover:text-indigo-600">
            {post.title}
          </h2>

          {/* カテゴリタグ（下部に押し付け） */}
          <div className="mt-auto flex flex-wrap gap-2 pt-4">
            {post.categories.map((category) => (
              <span
                key={category.id}
                className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 transition-colors group-hover:bg-indigo-100 group-hover:text-indigo-700"
              >
                {category.name}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PostSummary;
