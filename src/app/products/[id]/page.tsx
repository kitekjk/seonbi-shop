"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { StarRating } from "@/components/star-rating";
import { ReviewList, type ReviewItem } from "@/components/review-list";
import { ReviewForm } from "@/components/review-form";
import { addToCart } from "@/actions/cart";

interface ProductOption {
  id: string;
  name: string;
  additional_price: number;
  stock: number;
  is_active: boolean;
}

interface ProductImage {
  id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
}

interface ProductTag {
  id: string;
  tag: string;
}

interface ProductReview {
  id: string;
  user_id: string;
  rating: number;
  content: string;
  created_at: string;
  users: { name: string } | null;
  review_images: Array<{ id: string; url: string; sort_order: number }>;
}

interface Product {
  id: string;
  name: string;
  description: string;
  base_price: number;
  category: string;
  product_options: ProductOption[];
  product_images: ProductImage[];
  product_tags: ProductTag[];
  reviews: ProductReview[];
}

type Tab = "reviews" | "inquiries";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<Tab>("reviews");
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetch(`/api/products/${productId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.data) {
          setProduct(json.data);
          const activeOptions = (json.data.product_options ?? []).filter(
            (o: ProductOption) => o.is_active
          );
          if (activeOptions.length > 0) {
            setSelectedOption(activeOptions[0].id);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20 text-center">
        <p className="text-stone-400">상품을 불러오는 중...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20 text-center">
        <p className="text-lg text-stone-500">상품을 찾을 수 없습니다.</p>
        <Link href="/products" className="mt-4 inline-block text-sm text-brand-navy hover:underline">
          ← 상품 목록으로
        </Link>
      </div>
    );
  }

  const activeOptions = product.product_options.filter((o) => o.is_active);
  const option = activeOptions.find((o) => o.id === selectedOption);
  const totalPrice = (product.base_price + (option?.additional_price ?? 0)) * quantity;

  const sortedImages = [...product.product_images].sort((a, b) => a.sort_order - b.sort_order);

  const reviews: ReviewItem[] = (product.reviews ?? []).map((r) => ({
    id: r.id,
    userName: r.users?.name ?? "익명",
    rating: r.rating,
    content: r.content,
    createdAt: r.created_at,
    images: r.review_images?.map((ri) => ri.url),
  }));

  const avgRating =
    reviews.length > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
      : 0;

  const handleAddToCart = async () => {
    const result = await addToCart(product.id, quantity, selectedOption || undefined);
    if (result.error) {
      alert(result.error);
    } else {
      alert("장바구니에 추가되었습니다.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <nav className="mb-8 text-sm text-stone-400">
        <Link href="/" className="hover:text-brand-navy">홈</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-brand-navy">상품</Link>
        <span className="mx-2">/</span>
        <span className="text-stone-700">{product.name}</span>
      </nav>

      <div className="grid grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div>
          <div className="aspect-square rounded-xl bg-brand-cream flex items-center justify-center overflow-hidden">
            {sortedImages[selectedImage]?.url ? (
              <img
                src={sortedImages[selectedImage].url}
                alt={sortedImages[selectedImage].alt_text ?? product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-8xl">🏺</span>
            )}
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {(sortedImages.length > 0 ? sortedImages : [{ id: "ph", url: "", alt_text: "", sort_order: 0 }]).map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setSelectedImage(idx)}
                className={`aspect-square rounded-lg bg-brand-cream flex items-center justify-center text-2xl transition-all overflow-hidden ${
                  selectedImage === idx ? "ring-2 ring-brand-navy" : "opacity-60 hover:opacity-100"
                }`}
              >
                {img.url ? (
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                ) : (
                  "🏺"
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <span className="text-sm font-medium text-brand-gold">{product.category}</span>
          <h1 className="mt-2 text-3xl font-bold text-stone-900">{product.name}</h1>

          <div className="mt-3 flex items-center gap-2">
            <StarRating rating={avgRating} size="md" showValue />
            <span className="text-sm text-stone-400">({reviews.length}개 리뷰)</span>
          </div>

          <p className="mt-4 text-sm text-stone-600 leading-relaxed">{product.description}</p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {product.product_tags.map((t) => (
              <span key={t.id} className="rounded-full bg-brand-cream px-3 py-1 text-xs text-brand-gold-dark">
                #{t.tag}
              </span>
            ))}
          </div>

          <div className="mt-8 border-t border-stone-200 pt-6">
            <p className="text-3xl font-bold text-brand-navy">
              {product.base_price.toLocaleString("ko-KR")}원
            </p>
            <p className="mt-1 text-xs text-stone-400">배송비 3,000원 (50,000원 이상 무료배송)</p>
          </div>

          {activeOptions.length > 0 && (
            <div className="mt-6">
              <label className="text-sm font-semibold text-stone-700">옵션 선택</label>
              <div className="mt-2 space-y-2">
                {activeOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedOption(opt.id)}
                    className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-sm transition-all ${
                      selectedOption === opt.id
                        ? "border-brand-navy bg-blue-50 text-brand-navy"
                        : "border-stone-200 text-stone-600 hover:border-stone-300"
                    }`}
                  >
                    <span>{opt.name}</span>
                    <span className="flex items-center gap-3">
                      {opt.additional_price > 0 && (
                        <span className="text-xs text-stone-400">
                          +{opt.additional_price.toLocaleString("ko-KR")}원
                        </span>
                      )}
                      <span className="text-xs text-stone-400">재고 {opt.stock}개</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <label className="text-sm font-semibold text-stone-700">수량</label>
            <div className="mt-2 flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-md border border-stone-300 text-stone-600 hover:bg-stone-50"
              >
                −
              </button>
              <span className="w-12 text-center text-sm font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-md border border-stone-300 text-stone-600 hover:bg-stone-50"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-8 rounded-lg bg-stone-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-500">총 상품금액</span>
              <span className="text-2xl font-bold text-brand-red">
                {totalPrice.toLocaleString("ko-KR")}원
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={handleAddToCart}
              className="rounded-lg border-2 border-brand-navy py-3.5 text-sm font-semibold text-brand-navy transition-colors hover:bg-blue-50"
            >
              장바구니 담기
            </button>
            <Link
              href="/checkout"
              className="rounded-lg bg-brand-navy py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-navy-light"
            >
              바로 구매하기
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-16 border-t border-stone-200">
        <div className="flex border-b border-stone-200">
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-6 py-4 text-sm font-semibold transition-colors ${
              activeTab === "reviews"
                ? "border-b-2 border-brand-navy text-brand-navy"
                : "text-stone-400 hover:text-stone-600"
            }`}
          >
            리뷰 ({reviews.length})
          </button>
          <button
            onClick={() => setActiveTab("inquiries")}
            className={`px-6 py-4 text-sm font-semibold transition-colors ${
              activeTab === "inquiries"
                ? "border-b-2 border-brand-navy text-brand-navy"
                : "text-stone-400 hover:text-stone-600"
            }`}
          >
            상품 문의
          </button>
        </div>

        <div className="py-8">
          {activeTab === "reviews" && (
            <div>
              <div className="mb-8 flex items-center gap-8 rounded-lg bg-brand-cream p-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-brand-navy">{avgRating}</p>
                  <StarRating rating={avgRating} size="lg" />
                  <p className="mt-1 text-xs text-stone-400">{reviews.length}개 리뷰</p>
                </div>
                <div className="flex-1 space-y-1">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = reviews.filter((r) => r.rating === star).length;
                    const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="w-6 text-xs text-stone-500 text-right">{star}점</span>
                        <div className="h-2 flex-1 rounded-full bg-stone-200">
                          <div className="h-full rounded-full bg-brand-gold" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <ReviewForm productId={product.id} />
              <div className="mt-8">
                <ReviewList reviews={reviews} />
              </div>
            </div>
          )}

          {activeTab === "inquiries" && (
            <div className="py-12 text-center">
              <p className="text-stone-400">상품 문의는 로그인 후 이용 가능합니다.</p>
              <Link
                href="/login"
                className="mt-4 inline-block rounded-md border border-stone-300 px-6 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-50"
              >
                로그인하기
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
