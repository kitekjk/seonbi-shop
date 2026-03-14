"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phone: "",
    agreeTerms: false,
    agreePrivacy: false,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          name: form.name,
        }),
      });

      const json = await res.json();

      if (res.ok) {
        alert("회원가입이 완료되었습니다. 로그인해주세요.");
        router.push("/login");
      } else {
        setError(json.error ?? "회원가입에 실패했습니다.");
      }
    } catch {
      setError("회원가입 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-6 py-10">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-brand-navy">회원가입</h1>
          <p className="mt-2 text-sm text-stone-500">선비샵의 다양한 혜택을 누려보세요</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-stone-700">이름</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="이름을 입력하세요"
              required
              className="mt-1 w-full rounded-lg border border-stone-300 px-4 py-3 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700">이메일</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="your@email.com"
              required
              className="mt-1 w-full rounded-lg border border-stone-300 px-4 py-3 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700">비밀번호</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="8자 이상 입력하세요"
              required
              minLength={8}
              className="mt-1 w-full rounded-lg border border-stone-300 px-4 py-3 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700">비밀번호 확인</label>
            <input
              type="password"
              value={form.passwordConfirm}
              onChange={(e) => handleChange("passwordConfirm", e.target.value)}
              placeholder="비밀번호를 다시 입력하세요"
              required
              className="mt-1 w-full rounded-lg border border-stone-300 px-4 py-3 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700">연락처</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="010-0000-0000"
              className="mt-1 w-full rounded-lg border border-stone-300 px-4 py-3 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
            />
          </div>
          <div className="space-y-3 rounded-lg border border-stone-200 p-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.agreeTerms}
                onChange={(e) => handleChange("agreeTerms", e.target.checked)}
                required
                className="h-4 w-4 rounded border-stone-300 text-brand-navy focus:ring-brand-navy"
              />
              <span className="text-sm text-stone-600">
                <span className="font-medium text-brand-navy">[필수]</span> 이용약관에 동의합니다
              </span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.agreePrivacy}
                onChange={(e) => handleChange("agreePrivacy", e.target.checked)}
                required
                className="h-4 w-4 rounded border-stone-300 text-brand-navy focus:ring-brand-navy"
              />
              <span className="text-sm text-stone-600">
                <span className="font-medium text-brand-navy">[필수]</span> 개인정보처리방침에
                동의합니다
              </span>
            </label>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-brand-navy py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-light disabled:opacity-50"
          >
            {isLoading ? "가입 중..." : "회원가입"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-stone-500">
            이미 회원이신가요?{" "}
            <Link href="/login" className="font-semibold text-brand-navy hover:text-brand-navy-light">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
