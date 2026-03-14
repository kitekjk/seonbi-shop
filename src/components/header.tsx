import Link from "next/link";
import { cookies } from "next/headers";
import { SearchBar } from "./search-bar";
import { AuthButton } from "./auth-button";
import { isSupabaseConfigured } from "@/lib/mock-data";

async function getUser() {
  if (!isSupabaseConfigured()) {
    const cookieStore = await cookies();
    const mockAuth = cookieStore.get("mock-auth");
    if (!mockAuth) return null;
    try {
      return JSON.parse(mockAuth.value) as { email: string; name?: string };
    } catch {
      return null;
    }
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return { email: user.email ?? "", name: user.user_metadata?.name };
}

const NAV_ITEMS = [
  { href: "/products", label: "상품" },
  { href: "/events", label: "이벤트" },
  { href: "/cart", label: "장바구니" },
] as const;

export async function Header() {
  const user = await getUser();

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

          <AuthButton user={user} />
        </nav>
      </div>
    </header>
  );
}
