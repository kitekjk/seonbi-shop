"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface EventCoupon {
  id: string;
  coupons: {
    id: string;
    code: string;
    name: string;
    type: "fixed" | "percent";
    discount_value: number;
  };
}

interface EventComment {
  id: string;
  content: string;
  created_at: string;
  users: { id: string; name: string } | null;
}

interface EventData {
  id: string;
  title: string;
  description: string;
  body_html: string | null;
  starts_at: string;
  ends_at: string;
  event_coupons: EventCoupon[];
  event_comments: EventComment[];
}

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<EventComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [claimedCoupons, setClaimedCoupons] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch(`/api/events/${eventId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.data) {
          setEvent(json.data);
          setComments(json.data.event_comments ?? []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [eventId]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await fetch(`/api/events/${eventId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment.trim() }),
      });
      const json = await res.json();
      if (res.ok && json.data) {
        setComments((prev) => [...prev, json.data]);
        setNewComment("");
      } else {
        alert(json.error ?? "댓글 작성에 실패했습니다. 로그인이 필요합니다.");
      }
    } catch {
      alert("댓글 작성에 실패했습니다.");
    }
  };

  const handleClaimCoupon = (couponId: string) => {
    setClaimedCoupons((prev) => new Set(prev).add(couponId));
    alert("쿠폰이 발급되었습니다! 마이페이지 쿠폰함에서 확인하세요.");
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <p className="text-stone-400">이벤트를 불러오는 중...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <p className="text-lg text-stone-500">이벤트를 찾을 수 없습니다.</p>
        <Link href="/events" className="mt-4 inline-block text-sm text-brand-navy hover:underline">
          ← 이벤트 목록으로
        </Link>
      </div>
    );
  }

  const isOngoing = new Date(event.ends_at) >= new Date();
  const coupons = event.event_coupons ?? [];

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-brand-red to-brand-red-light text-white">
        <div className="p-10">
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                isOngoing ? "bg-white/20 text-white" : "bg-black/20 text-white/70"
              }`}
            >
              {isOngoing ? "진행중" : "종료"}
            </span>
            <span className="text-sm text-red-200">
              {new Date(event.starts_at).toLocaleDateString("ko-KR")} ~{" "}
              {new Date(event.ends_at).toLocaleDateString("ko-KR")}
            </span>
          </div>
          <h1 className="mt-4 text-4xl font-bold">{event.title}</h1>
          <p className="mt-3 text-lg text-red-100">{event.description}</p>
        </div>
      </div>

      {isOngoing && coupons.length > 0 && (
        <section className="mt-8 rounded-xl border-2 border-dashed border-brand-gold bg-brand-cream p-6">
          <h2 className="text-lg font-bold text-brand-gold-dark">🎫 이벤트 쿠폰 받기</h2>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {coupons.map((ec) => (
              <div
                key={ec.id}
                className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm"
              >
                <div>
                  <p className="text-sm font-bold text-brand-red">
                    {ec.coupons.type === "percent"
                      ? `${ec.coupons.discount_value}% 할인`
                      : `${ec.coupons.discount_value.toLocaleString("ko-KR")}원 할인`}
                  </p>
                  <p className="mt-0.5 text-xs text-stone-500">{ec.coupons.name}</p>
                </div>
                <button
                  onClick={() => handleClaimCoupon(ec.coupons.id)}
                  disabled={claimedCoupons.has(ec.coupons.id)}
                  className={`rounded-md px-4 py-2 text-xs font-semibold transition-colors ${
                    claimedCoupons.has(ec.coupons.id)
                      ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                      : "bg-brand-red text-white hover:bg-brand-red-light"
                  }`}
                >
                  {claimedCoupons.has(ec.coupons.id) ? "발급완료" : "쿠폰받기"}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {event.body_html && (
        <section className="mt-8 rounded-xl border border-stone-200 p-8">
          <div
            className="prose prose-stone max-w-none prose-headings:text-brand-navy prose-li:text-stone-600"
            dangerouslySetInnerHTML={{ __html: event.body_html }}
          />
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-bold text-stone-900">댓글 ({comments.length})</h2>
        <form onSubmit={handleCommentSubmit} className="mt-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요 (로그인 필요)"
              className="flex-1 rounded-lg border border-stone-300 px-4 py-3 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="rounded-lg bg-brand-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-light disabled:cursor-not-allowed disabled:opacity-50"
            >
              등록
            </button>
          </div>
        </form>
        <div className="mt-6 divide-y divide-stone-100">
          {comments.map((comment) => (
            <div key={comment.id} className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-cream text-xs font-semibold text-brand-navy">
                    {(comment.users?.name ?? "?").charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-stone-900">
                    {comment.users?.name ?? "익명"}
                  </span>
                </div>
                <span className="text-xs text-stone-400">
                  {new Date(comment.created_at).toLocaleDateString("ko-KR")}
                </span>
              </div>
              <p className="mt-2 pl-9 text-sm text-stone-600">{comment.content}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
