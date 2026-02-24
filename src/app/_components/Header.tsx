import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode, faUserLock } from "@fortawesome/free-solid-svg-icons";

const Header: React.FC = () => {
  return (
    // sticky と backdrop-blur で「すりガラス」の追従ヘッダーにする
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/70 shadow-sm backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        {/* ロゴ部分（グラデーションテキスト＆アイコン） */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
            <FontAwesomeIcon icon={faCode} className="text-xl" />
          </div>
          <span className="bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent">
            MyBlog<span className="text-indigo-600">.</span>
          </span>
        </Link>

        {/* ナビゲーション */}
        <nav className="flex items-center gap-6 text-sm font-bold text-slate-600">
          <Link
            href="/about"
            className="transition-colors hover:text-indigo-600"
          >
            About
          </Link>

          {/* 管理者用ボタン（目立たせつつ上品に） */}
          <Link
            href="/admin/posts"
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-indigo-600 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-50 hover:shadow-md"
          >
            <FontAwesomeIcon icon={faUserLock} />
            管理者機能
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
