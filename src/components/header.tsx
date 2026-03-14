import Link from "next/link";
import { SearchBar } from "./search-bar";

const NAV_ITEMS = [
  { href: "/products", label: "상품" },
  { href: "/events", label: "이벤트" },
  { href: "/cart", label: "장바구니" },
  { href: "/mypage", label: "마이페이지" },
] as const;

export function Header() {
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-brand-navy"
        >
          선비샵
        </Link>

        <div className="hidden lg:block">
          <SearchBar />
        </div>

        <nav className="flex items-center gap-6">
          {NAV_ITEMS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-stone-600 transition-colors hover:text-brand-red"
            >
              {label}
            </Link>
          ))}

          <Link
            href="/login"
            className="rounded-md bg-brand-navy px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-navy-light"
          >
            로그인
          </Link>
        </nav>
      </div>
    </header>
  );
}
