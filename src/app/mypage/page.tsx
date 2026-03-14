"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StarRating } from "@/components/star-rating";
import { CouponBadge } from "@/components/coupon-badge";
import { AddressForm } from "@/components/address-form";

type Tab = "reviews" | "coupons" | "addresses" | "inquiries";

interface UserProfile {
  name: string;
  email: string;
}

interface Review {
  id: string;
  rating: number;
  content: string;
  created_at: string;
  products: { name: string } | null;
}

interface Coupon {
  id: string;
  is_used: boolean;
  coupons: {
    name: string;
    type: "fixed" | "percent";
    discount_value: number;
    expires_at: string;
  };
}

interface Inquiry {
  id: string;
  type: string;
  title: string;
  status: string;
  created_at: string;
}

export default function MyPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("reviews");
  const [showAddressForm, setShowAddressForm] = useState(false);

  const [user, setUser] = useState<UserProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then((r) => r.json()).catch(() => ({ user: null })),
      fetch("/api/reviews?my=true").then((r) => r.json()).catch(() => ({ data: [] })),
      fetch("/api/coupons/my").then((r) => r.json()).catch(() => ({ data: [] })),
      fetch("/api/inquiries/my").then((r) => r.json()).catch(() => ({ data: [] })),
    ]).then(([authRes, reviewsRes, couponsRes, inquiriesRes]) => {
      if (!authRes.user) {
        router.push("/login");
        return;
      }
      setUser({ name: authRes.user.name ?? "회원", email: authRes.user.email ?? "" });
      setReviews(reviewsRes.data ?? []);
      setCoupons(couponsRes.data ?? []);
      setInquiries(inquiriesRes.data ?? []);
      setLoading(false);
    });
  }, [router]);

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("리뷰를 삭제하시겠습니까?")) return;
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, { method: "DELETE" });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      } else {
        alert("리뷰 삭제에 실패했습니다.");
      }
    } catch {
      alert("리뷰 삭제에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <p className="text-stone-400">마이페이지를 불러오는 중...</p>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  const TABS: { key: Tab; label: string; count: number }[] = [
    { key: "reviews", label: "내 리뷰", count: reviews.length },
    { key: "coupons", label: "쿠폰함", count: coupons.filter((c) => !c.is_used).length },
    { key: "addresses", label: "배송지 관리", count: 0 },
    { key: "inquiries", label: "문의 내역", count: inquiries.length },
  ];

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex items-center gap-6 rounded-xl bg-gradient-to-r from-brand-navy to-brand-navy-light p-8 text-white">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-2xl font-bold">
          {user.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user.name}님</h1>
          {user.email && <p className="mt-1 text-sm text-blue-200">{user.email}</p>}
        </div>
        <div className="ml-auto">
          <Link
            href="/orders"
            className="rounded-lg bg-white/20 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-white/30"
          >
            주문 내역 →
          </Link>
        </div>
      </div>

      <div className="mt-8 border-b border-stone-200">
        <div className="flex">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-4 text-sm font-semibold transition-colors ${
                activeTab === tab.key
                  ? "border-b-2 border-brand-navy text-brand-navy"
                  : "text-stone-400 hover:text-stone-600"
              }`}
            >
              {tab.label}
              <span className="ml-1.5 text-xs">({tab.count})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        {activeTab === "reviews" && (
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="py-12 text-center text-stone-400">작성한 리뷰가 없습니다.</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="rounded-lg border border-stone-200 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-stone-900">
                        {review.products?.name ?? "상품"}
                      </p>
                      <StarRating rating={review.rating} size="sm" />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-stone-400">
                        {new Date(review.created_at).toLocaleDateString("ko-KR")}
                      </span>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="text-xs text-stone-400 hover:text-brand-red"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-stone-600">{review.content}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "coupons" && (
          <div className="space-y-3">
            {coupons.length === 0 ? (
              <p className="py-12 text-center text-stone-400">쿠폰이 없습니다.</p>
            ) : (
              coupons.map((uc) => (
                <CouponBadge
                  key={uc.id}
                  name={uc.coupons.name}
                  type={uc.coupons.type}
                  discountValue={uc.coupons.discount_value}
                  expiresAt={uc.coupons.expires_at}
                  isUsed={uc.is_used}
                />
              ))
            )}
          </div>
        )}

        {activeTab === "addresses" && (
          <div>
            {showAddressForm ? (
              <div className="rounded-lg border border-stone-200 p-6">
                <h3 className="mb-4 text-sm font-semibold text-stone-900">새 배송지 추가</h3>
                <AddressForm onCancel={() => setShowAddressForm(false)} />
              </div>
            ) : (
              <button
                onClick={() => setShowAddressForm(true)}
                className="mt-4 rounded-lg border-2 border-dashed border-stone-300 px-6 py-3 text-sm font-medium text-stone-500 transition-colors hover:border-brand-navy hover:text-brand-navy w-full"
              >
                + 새 배송지 추가
              </button>
            )}
          </div>
        )}

        {activeTab === "inquiries" && (
          <div className="space-y-3">
            {inquiries.length === 0 ? (
              <p className="py-12 text-center text-stone-400">문의 내역이 없습니다.</p>
            ) : (
              inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="flex items-center justify-between rounded-lg border border-stone-200 p-5"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        inq.status === "answered"
                          ? "bg-green-50 text-green-700"
                          : inq.status === "pending"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-stone-100 text-stone-500"
                      }`}
                    >
                      {inq.status === "answered"
                        ? "답변완료"
                        : inq.status === "pending"
                          ? "답변대기"
                          : "처리완료"}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-stone-900">{inq.title}</p>
                      <p className="text-xs text-stone-400">
                        {new Date(inq.created_at).toLocaleDateString("ko-KR")}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
