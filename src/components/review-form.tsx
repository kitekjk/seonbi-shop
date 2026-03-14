"use client";

import { useState } from "react";

interface ReviewFormProps {
  productId: string;
  onSubmit?: (data: { rating: number; content: string }) => void;
}

export function ReviewForm({ productId, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !content.trim()) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("product_id", productId);
      formData.append("rating", String(rating));
      formData.append("content", content.trim());

      const res = await fetch("/api/reviews", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        onSubmit?.({ rating, content });
        setRating(0);
        setContent("");
        alert("리뷰가 등록되었습니다.");
      } else {
        const json = await res.json();
        alert(json.error ?? "리뷰 등록에 실패했습니다. 로그인이 필요합니다.");
      }
    } catch {
      alert("리뷰 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-stone-200 bg-white p-5">
      <h4 className="text-sm font-semibold text-stone-900">리뷰 작성</h4>

      <div className="mt-3">
        <p className="text-xs text-stone-500 mb-1.5">별점</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className={`text-2xl transition-colors ${
                star <= (hoverRating || rating) ? "text-brand-gold" : "text-stone-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="상품에 대한 솔직한 리뷰를 남겨주세요"
          rows={4}
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2 text-xs text-stone-500 hover:text-stone-700">
          <span className="rounded border border-stone-300 px-2 py-1">사진 첨부</span>
          <input type="file" accept="image/*" multiple className="hidden" />
        </label>
        <button
          type="submit"
          disabled={rating === 0 || !content.trim() || isSubmitting}
          className="rounded-md bg-brand-navy px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-navy-light disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "등록 중..." : "리뷰 등록"}
        </button>
      </div>
    </form>
  );
}
