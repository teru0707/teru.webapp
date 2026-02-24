"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faStar,
  faSpinner,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import type { PostApiResponse } from "@/app/_types/PostApiResponse";
import dayjs from "dayjs";

const Page: React.FC = () => {
  const [posts, setPosts] = useState<PostApiResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // 🌟 検索キーワードの状態

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (error) {
        console.error("取得エラー:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // 🌟 検索キーワードで記事をリアルタイムに絞り込み（タイトルとカテゴリ名で検索）
  const filteredPosts = useMemo(() => {
    if (!searchQuery) return posts;
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.categories.some((c) =>
          c.category.name.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
    );
  }, [posts, searchQuery]);

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100 },
    },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }, // 消える時のアニメーション
  };

  return (
    <main className="w-full">
      {/* ヒーローセクション */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 px-8 py-20 shadow-2xl sm:px-16 sm:py-24"
      >
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-bold text-indigo-300 backdrop-blur-md"
          >
            <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
            Welcome to Next.js Modern Blog
          </motion.div>

          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            知識を共有し、
            <br className="sm:hidden" />
            <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              未来を創る。
            </span>
          </h1>
        </div>
      </motion.section>

      {/* 🌟 検索バー＆見出しセクション */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-800">
          Latest Stories
        </h2>

        {/* スタイリッシュなすりガラス風の検索バー */}
        <div className="relative w-full sm:w-72">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <FontAwesomeIcon icon={faSearch} className="text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="記事やタグを検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-white/60 bg-white/50 py-3 pr-4 pl-11 text-sm font-medium text-slate-800 shadow-sm backdrop-blur-md transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:outline-none"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-3xl" />
        </div>
      ) : (
        <motion.div layout className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* 🌟 AnimatePresence で絞り込み時のアニメーションを有効化 */}
          <AnimatePresence>
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  layout // 要素の並び替えもスムーズにアニメーション
                >
                  <Link
                    href={`/posts/${post.id}`}
                    className="group block h-full"
                  >
                    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/50 bg-white/60 shadow-sm ring-1 ring-slate-200/50 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:bg-white hover:shadow-xl hover:ring-indigo-300">
                      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                        <Image
                          src={post.coverImageURL}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>

                      <div className="flex flex-1 flex-col p-6">
                        <div className="mb-3 text-sm font-bold tracking-wider text-slate-400">
                          {dayjs(post.createdAt).format("YYYY.MM.DD")}
                        </div>
                        <h3 className="mb-4 line-clamp-2 text-xl leading-snug font-bold text-slate-800 transition-colors group-hover:text-indigo-600">
                          {post.title}
                        </h3>

                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {post.categories.slice(0, 2).map((c) => (
                              <span
                                key={c.category.id}
                                className="rounded-full bg-slate-200/50 px-3 py-1 text-xs font-bold text-slate-600"
                              >
                                {c.category.name}
                              </span>
                            ))}
                          </div>
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                            <FontAwesomeIcon icon={faArrowRight} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center font-bold text-slate-500"
              >
                「{searchQuery}」に一致する記事は見つかりませんでした😢
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </main>
  );
};

export default Page;
