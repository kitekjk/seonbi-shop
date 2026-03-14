"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCart } from "@/actions/cart";

interface CartItem {
  product_id: string;
  quantity: number;
  option_id: string | null;
  products: { name: string; base_price: number };
  product_options: { id: string; name: string; additional_price: number } | null;
}

type PaymentMethod = "mock_card" | "mock_bank_transfer" | "mock_virtual_account";

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [recipientName, setRecipientName] = useState("");
  const [phone, setPhone] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mock_card");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<{ orderNumber: string } | null>(null);

  useEffect(() => {
    getCart().then((result) => {
      if (result.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setCartItems(result.data as any[]);
      }
      setLoading(false);
    });
  }, []);

  const getItemPrice = (item: CartItem) =>
    item.products.base_price + (item.product_options?.additional_price ?? 0);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + getItemPrice(item) * item.quantity,
    0
  );
  const shippingFee = subtotal >= 50000 ? 0 : 3000;
  const total = subtotal + shippingFee;

  const handleOrder = async () => {
    if (!recipientName || !phone || !postalCode || !addressLine1) {
      alert("배송지 정보를 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            product_id: item.product_id,
            option_id: item.product_options?.id ?? null,
            quantity: item.quantity,
          })),
          recipient_name: recipientName,
          phone,
          postal_code: postalCode,
          address_line1: addressLine1,
          address_line2: addressLine2 || null,
          payment_method: paymentMethod,
          note: note || null,
        }),
      });

      const json = await res.json();
      if (res.ok) {
        setOrderResult({ orderNumber: json.order.order_number });
      } else {
        alert(json.error ?? "주문에 실패했습니다.");
      }
    } catch {
      alert("주문 처리 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderResult) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <div className="text-6xl">🎉</div>
        <h1 className="mt-6 text-3xl font-bold text-brand-navy">주문이 완료되었습니다!</h1>
        <p className="mt-3 text-stone-500">
          주문번호: <span className="font-semibold text-stone-900">{orderResult.orderNumber}</span>
        </p>
        <p className="mt-1 text-sm text-stone-400">
          주문 상세 내역은 마이페이지에서 확인하실 수 있습니다.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/orders"
            className="rounded-lg bg-brand-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-light"
          >
            주문 내역 보기
          </Link>
          <Link
            href="/products"
            className="rounded-lg border border-stone-300 px-6 py-3 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
          >
            쇼핑 계속하기
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20 text-center">
        <p className="text-stone-400">주문 정보를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold text-stone-900">주문서</h1>

      <div className="mt-8 grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          {/* Shipping Address */}
          <section className="rounded-xl border border-stone-200 p-6">
            <h2 className="text-lg font-bold text-stone-900">배송지 정보</h2>
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700">수령인</label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="이름"
                    className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700">연락처</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="010-0000-0000"
                    className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700">우편번호</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="우편번호"
                  className="mt-1 w-32 rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700">주소</label>
                <input
                  type="text"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="기본 주소"
                  className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                />
                <input
                  type="text"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  placeholder="상세 주소"
                  className="mt-2 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                />
              </div>
            </div>
          </section>

          {/* Order Items */}
          <section className="rounded-xl border border-stone-200 p-6">
            <h2 className="text-lg font-bold text-stone-900">주문 상품</h2>
            <div className="mt-4 divide-y divide-stone-100">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 py-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-brand-cream text-2xl">
                    🏺
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-stone-900">{item.products.name}</p>
                    <p className="text-xs text-stone-400">
                      옵션: {item.product_options?.name ?? "기본"} / 수량: {item.quantity}개
                    </p>
                  </div>
                  <p className="text-sm font-bold text-stone-900">
                    {(getItemPrice(item) * item.quantity).toLocaleString("ko-KR")}원
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Payment Method */}
          <section className="rounded-xl border border-stone-200 p-6">
            <h2 className="text-lg font-bold text-stone-900">결제 수단</h2>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { value: "mock_card" as const, label: "신용카드", icon: "💳" },
                { value: "mock_bank_transfer" as const, label: "계좌이체", icon: "🏦" },
                { value: "mock_virtual_account" as const, label: "가상계좌", icon: "📋" },
              ].map((method) => (
                <button
                  key={method.value}
                  onClick={() => setPaymentMethod(method.value)}
                  className={`flex flex-col items-center gap-2 rounded-lg border py-4 transition-colors ${
                    paymentMethod === method.value
                      ? "border-brand-navy bg-blue-50 text-brand-navy"
                      : "border-stone-200 text-stone-500 hover:border-stone-300"
                  }`}
                >
                  <span className="text-2xl">{method.icon}</span>
                  <span className="text-sm font-medium">{method.label}</span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-stone-400">
              * 데모용 Mock 결제입니다. 실제 결제가 이루어지지 않습니다.
            </p>
          </section>

          {/* Delivery Note */}
          <section className="rounded-xl border border-stone-200 p-6">
            <h2 className="text-lg font-bold text-stone-900">배송 메모</h2>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="배송 시 요청사항을 입력해주세요"
              rows={3}
              className="mt-3 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
            />
          </section>
        </div>

        {/* Payment Summary */}
        <div>
          <div className="sticky top-6 rounded-xl border border-stone-200 bg-white p-6">
            <h2 className="text-lg font-bold text-stone-900">결제 금액</h2>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500">상품금액</span>
                <span className="font-medium">{subtotal.toLocaleString("ko-KR")}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">배송비</span>
                <span className="font-medium">
                  {shippingFee === 0 ? "무료" : `${shippingFee.toLocaleString("ko-KR")}원`}
                </span>
              </div>
            </div>
            <div className="mt-4 border-t border-stone-200 pt-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-stone-900">총 결제금액</span>
                <span className="text-xl font-bold text-brand-red">
                  {total.toLocaleString("ko-KR")}원
                </span>
              </div>
            </div>
            <button
              onClick={handleOrder}
              disabled={isSubmitting || cartItems.length === 0}
              className="mt-6 w-full rounded-lg bg-brand-red py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-red-light disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "처리중..." : `${total.toLocaleString("ko-KR")}원 결제하기`}
            </button>
            <p className="mt-3 text-center text-xs text-stone-400">
              주문 내용을 확인하였으며, 결제에 동의합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
