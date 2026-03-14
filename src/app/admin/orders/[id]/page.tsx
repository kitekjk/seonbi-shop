"use client";

import Link from "next/link";
import { useState } from "react";
import StatusSelect from "@/components/admin/status-select";

const orderStatusOptions = [
  { value: "payment_completed", label: "결제완료", color: "#2563eb" },
  { value: "preparing", label: "준비중", color: "#d97706" },
  { value: "shipping", label: "배송중", color: "#7c3aed" },
  { value: "delivered", label: "배송완료", color: "#16a34a" },
  { value: "cancelled", label: "취소", color: "#dc2626" },
];

const shipmentStatusOptions = [
  { value: "preparing", label: "준비중", color: "#d97706" },
  { value: "picked_up", label: "집하", color: "#2563eb" },
  { value: "in_transit", label: "이동중", color: "#7c3aed" },
  { value: "out_for_delivery", label: "배송출발", color: "#0891b2" },
  { value: "delivered", label: "배송완료", color: "#16a34a" },
];

const mockOrder = {
  id: "1",
  order_number: "ORD-20260315-00024",
  status: "preparing",
  created_at: "2026-03-15 14:23",
  customer: {
    name: "김민수",
    email: "minsu.kim@example.com",
    phone: "010-1234-5678",
  },
  shipping: {
    recipient_name: "김민수",
    phone: "010-1234-5678",
    postal_code: "06234",
    address_line1: "서울특별시 강남구 테헤란로 123",
    address_line2: "선비아파트 302호",
  },
  items: [
    { id: "1", product_name: "한복 열쇠고리 세트", option_name: "빨강", quantity: 2, unit_price: 15000, total_price: 30000 },
    { id: "2", product_name: "전통 부채 (대)", option_name: null, quantity: 1, unit_price: 35000, total_price: 35000 },
  ],
  payment: {
    method: "mock_card",
    amount: 62000,
    status: "completed",
    transaction_id: "TXN-20260315-A1B2C",
    paid_at: "2026-03-15 14:25",
  },
  shipment: {
    carrier: "CJ대한통운",
    tracking_number: "",
    status: "preparing",
  },
  total_amount: 65000,
  discount_amount: 6000,
  shipping_fee: 3000,
  final_amount: 62000,
  note: "부재시 경비실에 맡겨주세요.",
};

const paymentMethodLabels: Record<string, string> = {
  mock_card: "신용카드",
  mock_bank_transfer: "계좌이체",
  mock_virtual_account: "가상계좌",
};

export default function OrderDetailPage() {
  const [orderStatus, setOrderStatus] = useState(mockOrder.status);
  const [shipmentStatus, setShipmentStatus] = useState(mockOrder.shipment.status);
  const [carrier, setCarrier] = useState(mockOrder.shipment.carrier);
  const [trackingNumber, setTrackingNumber] = useState(mockOrder.shipment.tracking_number);

  function handleSave() {
    alert("주문 정보가 업데이트되었습니다. (데모)");
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <Link href="/admin/orders" className="text-stone-400 hover:text-stone-600">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-stone-900">주문 상세</h1>
          <p className="mt-1 text-sm text-stone-500">{mockOrder.order_number} · {mockOrder.created_at}</p>
        </div>
        <StatusSelect value={orderStatus} options={orderStatusOptions} onChange={setOrderStatus} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Left column */}
        <div className="xl:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-stone-900">주문 상품</h2>
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-200 text-left text-xs font-semibold text-stone-500 uppercase">
                  <th className="pb-3">상품</th>
                  <th className="pb-3">옵션</th>
                  <th className="pb-3 text-right">단가</th>
                  <th className="pb-3 text-right">수량</th>
                  <th className="pb-3 text-right">소계</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {mockOrder.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3 text-sm font-medium text-stone-900">{item.product_name}</td>
                    <td className="py-3 text-sm text-stone-500">{item.option_name ?? "-"}</td>
                    <td className="py-3 text-right text-sm text-stone-700">₩{item.unit_price.toLocaleString()}</td>
                    <td className="py-3 text-right text-sm text-stone-700">{item.quantity}</td>
                    <td className="py-3 text-right text-sm font-medium text-stone-900">₩{item.total_price.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 space-y-1 border-t border-stone-200 pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500">상품 합계</span>
                <span>₩{mockOrder.total_amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">할인</span>
                <span className="text-red-600">-₩{mockOrder.discount_amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">배송비</span>
                <span>₩{mockOrder.shipping_fee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-2 text-base font-bold">
                <span>결제금액</span>
                <span>₩{mockOrder.final_amount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-stone-900">배송 정보</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-700">배송 상태</label>
                <StatusSelect value={shipmentStatus} options={shipmentStatusOptions} onChange={setShipmentStatus} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-700">택배사</label>
                <input
                  type="text"
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:border-[var(--color-brand-navy)] focus:ring-1 focus:ring-[var(--color-brand-navy)] focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-stone-700">운송장 번호</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="운송장 번호를 입력하세요"
                  className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:border-[var(--color-brand-navy)] focus:ring-1 focus:ring-[var(--color-brand-navy)] focus:outline-none"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSave}
                className="rounded-lg bg-[var(--color-brand-navy)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
              >
                배송 정보 저장
              </button>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-stone-900">고객 정보</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-stone-500">이름</dt>
                <dd className="font-medium text-stone-900">{mockOrder.customer.name}</dd>
              </div>
              <div>
                <dt className="text-stone-500">이메일</dt>
                <dd className="text-stone-900">{mockOrder.customer.email}</dd>
              </div>
              <div>
                <dt className="text-stone-500">연락처</dt>
                <dd className="text-stone-900">{mockOrder.customer.phone}</dd>
              </div>
            </dl>
          </div>

          {/* Shipping Address */}
          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-stone-900">배송지</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-stone-500">수령인</dt>
                <dd className="font-medium text-stone-900">{mockOrder.shipping.recipient_name}</dd>
              </div>
              <div>
                <dt className="text-stone-500">연락처</dt>
                <dd className="text-stone-900">{mockOrder.shipping.phone}</dd>
              </div>
              <div>
                <dt className="text-stone-500">주소</dt>
                <dd className="text-stone-900">
                  [{mockOrder.shipping.postal_code}] {mockOrder.shipping.address_line1}
                  <br />{mockOrder.shipping.address_line2}
                </dd>
              </div>
              {mockOrder.note && (
                <div>
                  <dt className="text-stone-500">배송 메모</dt>
                  <dd className="text-stone-900">{mockOrder.note}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Payment Info */}
          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-stone-900">결제 정보</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-stone-500">결제수단</dt>
                <dd className="font-medium text-stone-900">{paymentMethodLabels[mockOrder.payment.method] ?? mockOrder.payment.method}</dd>
              </div>
              <div>
                <dt className="text-stone-500">결제금액</dt>
                <dd className="font-medium text-stone-900">₩{mockOrder.payment.amount.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-stone-500">거래번호</dt>
                <dd className="font-mono text-xs text-stone-700">{mockOrder.payment.transaction_id}</dd>
              </div>
              <div>
                <dt className="text-stone-500">결제일시</dt>
                <dd className="text-stone-900">{mockOrder.payment.paid_at}</dd>
              </div>
              <div>
                <dt className="text-stone-500">결제상태</dt>
                <dd>
                  <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                    완료
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
