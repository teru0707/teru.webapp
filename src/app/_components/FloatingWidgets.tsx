"use client";
import { motion, useScroll } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faLink } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

export default function FloatingWidgets() {
  // 🌟 Framer Motionでスクロール量を自動取得
  const { scrollYProgress } = useScroll();

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("記事のURLをコピーしました！🔗");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* 🌟 1. 画面トップの虹色スクロール・プログレスバー */}
      <motion.div
        className="fixed top-0 right-0 left-0 z-[100] h-1.5 origin-left bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600"
        style={{ scaleX: scrollYProgress }}
      />

      {/* 🌟 2. 右下のフローティングアクションボタン (FAB) */}
      <div className="fixed right-8 bottom-8 z-50 flex flex-col gap-3">
        <button
          onClick={handleCopy}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-indigo-600 shadow-lg ring-1 ring-slate-200 backdrop-blur-md transition-all hover:scale-110 hover:bg-indigo-50"
          title="URLをコピー"
        >
          <FontAwesomeIcon icon={faLink} className="text-lg" />
        </button>
        <button
          onClick={scrollToTop}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800/90 text-white shadow-lg backdrop-blur-md transition-all hover:scale-110 hover:bg-slate-700"
          title="トップへ戻る"
        >
          <FontAwesomeIcon icon={faArrowUp} className="text-lg" />
        </button>
      </div>
    </>
  );
}
