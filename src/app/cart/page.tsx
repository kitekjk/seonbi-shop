"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getCart, updateCartQuantity, removeFromCart } from "@/actions/cart";

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  products: {
    id: string;
    name: string;
    base_price: number;
    product_images: Array<{ url: string; sort_order: number }>;
  };
  product_options: {
    id: string;
    name: string;
    additional_price: number;
  } | null;
  checked: boolean;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    name: string;
    discount: number;
  } | null>(null);

  useEffect(() => {
    getCart().then((result) => {
      if (result.data) {
        setItems(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (result.data as any[]).map((item: any) => ({
            ...item,
            checked: true,
          }))
        );
      }
      setLoading(false);
    });
  }, []);

  const toggleCheck = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const toggleAll = () => {
    const allChecked = items.every((i) => i.checked);
    setItems((prev) => prev.map((item) => ({ ...item, checked: !allChecked })));
  };

  const handleUpdateQuantity = async (id: string, delta: number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const newQty = Math.max(1, item.quantity + delta);
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: newQty } : i))
    );
    await updateCartQuantity(id, newQty);
  };

  const handleRemoveItem = async (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    await removeFromCart(id);
  };

  const applyCoupon = async () => {
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, total_amount: subtotal }),
      });
      const json = await res.json();
      if (json.valid) {
        setAppliedCoupon({
          name: json.coupon.name,
          discount: json.calculated_discount ?? 0,
        });
      } else {
        alert(json.error ?? "유효하지 않은 쿠폰코드입니다.");
      }
    } catch {
      alert("쿠폰 확인에 실패했습니다.");
    }
  };

  const getItemPrice = (item: CartItem) => {
    return item.products.base_price + (item.product_options?.additional_price ?? 0);
  };

  const checkedItems = items.filter((i) => i.checked);
  const subtotal = checkedItems.reduce(
    (sum, item) => sum + getItemPrice(item) * item.quantity,
    0
  );
  const discount = appliedCoupon?.discount ?? 0;
  const shippingFee = subtotal >= 50000 ? 0 : 3000;
  const total = subtotal - discount + shippingFee;

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20 text-center">
        <p className="text-stone-400">장바구니를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold text-stone-900">장바구니</h1>

      {items.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-6xl">🛒</p>
          <p className="mt-4 text-lg font-medium text-stone-500">장바구니가 비어있습니다</p>
          <Link
            href="/products"
            className="mt-6 inline-block rounded-lg bg-brand-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-light"
          >
            상품 둘러보기
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-3 gap-8">
          <div className="col-span-2">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={items.every((i) => i.checked)}
                  onChange={toggleAll}
                  className="h-4 w-4 rounded border-stone-300 text-brand-navy focus:ring-brand-navy"
                />
                <span className="text-sm font-medium text-stone-700">
                  전체선택 ({checkedItems.length}/{items.length})
                </span>
              </label>
              <button
                onClick={() => {
                  const toRemove = items.filter((i) => i.checked);
                  toRemove.forEach((i) => handleRemoveItem(i.id));
                }}
                className="text-xs text-stone-400 hover:text-stone-600"
              >
                선택 삭제
              </button>
            </div>

            <div className="divide-y divide-stone-100">
              {items.map((item) => {
                const price = getItemPrice(item);
                return (
                  <div key={item.id} className="flex items-center gap-4 py-6">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleCheck(item.id)}
                      className="h-4 w-4 rounded border-stone-300 text-brand-navy focus:ring-brand-navy"
                    />
                    <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-brand-cream text-3xl overflow-hidden">
                      {item.products.product_images?.[0]?.url ? (
                        <img src={item.products.product_images[0].url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        "🏺"
                      )}
                    </div>
                    <div className="flex-1">
                      <Link
                        href={`/products/${item.product_id}`}
                        className="text-sm font-semibold text-stone-900 hover:text-brand-navy"
                      >
                        {item.products.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-stone-400">
                        옵션: {item.product_options?.name ?? "기본"}
                      </p>
                      <p className="mt-1 text-sm font-bold text-brand-navy">
                        {price.toLocaleString("ko-KR")}원
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                        className="flex h-8 w-8 items-center justify-center rounded border border-stone-300 text-sm hover:bg-stone-50"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                        className="flex h-8 w-8 items-center justify-center rounded border border-stone-300 text-sm hover:bg-stone-50"
                      >
                        +
                      </button>
                    </div>
                    <p className="w-28 text-right text-sm font-bold text-stone-900">
                      {(price * item.quantity).toLocaleString("ko-KR")}원
                    </p>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-stone-300 hover:text-stone-500"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="sticky top-6 rounded-xl border border-stone-200 bg-white p-6">
              <h2 className="text-lg font-bold text-stone-900">주문 요약</h2>
              <div className="mt-5">
                <label className="text-xs font-medium text-stone-500">쿠폰 적용</label>
                <div className="mt-1.5 flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="쿠폰 코드 입력"
                    className="flex-1 rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                  />
                  <button
                    onClick={applyCoupon}
                    className="rounded-md bg-stone-800 px-3 py-2 text-xs font-medium text-white hover:bg-stone-700"
                  >
                    적용
                  </button>
                </div>
                {appliedCoupon && (
                  <p className="mt-1.5 text-xs text-green-600">✓ {appliedCoupon.name} 적용됨</p>
                )}
              </div>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-500">상품금액</span>
                  <span className="font-medium">{subtotal.toLocaleString("ko-KR")}원</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-brand-red">
                    <span>쿠폰 할인</span>
                    <span className="font-medium">-{discount.toLocaleString("ko-KR")}원</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-stone-500">배송비</span>
                  <span className="font-medium">
                    {shippingFee === 0 ? "무료" : `${shippingFee.toLocaleString("ko-KR")}원`}
                  </span>
                </div>
                {shippingFee > 0 && subtotal > 0 && (
                  <p className="text-xs text-stone-400">
                    {(50000 - subtotal).toLocaleString("ko-KR")}원 추가 시 무료배송
                  </p>
                )}
              </div>

              <div className="mt-4 border-t border-stone-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-900">총 결제금액</span>
                  <span className="text-xl font-bold text-brand-red">
                    {total.toLocaleString("ko-KR")}원
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-6 block rounded-lg bg-brand-navy py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-navy-light"
              >
                주문하기 ({checkedItems.length}개)
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
