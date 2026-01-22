/* src/app/_components/Header.tsx */
"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFish, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        {/* ロゴ */}
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-800 transition-colors hover:text-indigo-600"
        >
          <FontAwesomeIcon icon={faFish} className="text-xl text-indigo-600" />
          <span className="text-xl font-bold">TERUKI BLOG</span>
        </Link>

        {/* ナビゲーション */}
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="/" className="transition-colors hover:text-indigo-600">
            Home
          </Link>
          <Link
            href="/about"
            className="flex items-center gap-1 transition-colors hover:text-indigo-600"
          >
            <FontAwesomeIcon icon={faUserCircle} />
            About
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
