"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

interface AuthButtonProps {
  user: { email: string; name?: string } | null;
}

export function AuthButton({ user }: AuthButtonProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="rounded-md bg-brand-navy px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-navy-light"
        >
          로그인
        </Link>
        <Link
          href="/signup"
          className="rounded-md border border-brand-navy px-4 py-2 text-sm font-medium text-brand-navy transition-colors hover:bg-brand-navy hover:text-white"
        >
          회원가입
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/mypage"
        className="text-sm font-medium text-stone-600 transition-colors hover:text-brand-red"
      >
        마이페이지
      </Link>
      <button
        onClick={handleLogout}
        className="rounded-md border border-stone-300 px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100"
      >
        로그아웃
      </button>
    </div>
  );
}
