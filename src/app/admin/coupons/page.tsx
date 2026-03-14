"use client";

import { useState } from "react";
import DataTable, { type Column } from "@/components/admin/data-table";

interface Coupon {
  [key: string]: unknown;
  id: string;
  code: string;
  name: string;
  type: "fixed" | "percent";
  discount_value: number;
  min_order_amount: number;
  max_discount_amount: number | null;
  starts_at: string;
  expires_at: string;
  max_uses: number | null;
  used_count: number;
  is_active: boolean;
}

const mockCoupons: Coupon[] = [
  { id: "1", code: "WELCOME10", name: "신규 가입 할인", type: "percent", discount_value: 10, min_order_amount: 30000, max_discount_amount: 10000, starts_at: "2026-01-01", expires_at: "2026-12-31", max_uses: 1000, used_count: 245, is_active: true },
  { id: "2", code: "SPRING5000", name: "봄맞이 할인", type: "fixed", discount_value: 5000, min_order_amount: 50000, max_discount_amount: null, starts_at: "2026-03-01", expires_at: "2026-04-30", max_uses: 500, used_count: 89, is_active: true },
  { id: "3", code: "VIP20", name: "VIP 특별 할인", type: "percent", discount_value: 20, min_order_amount: 100000, max_discount_amount: 30000, starts_at: "2026-01-01", expires_at: "2026-06-30", max_uses: 100, used_count: 34, is_active: true },
  { id: "4", code: "FREESHIP", name: "무료배송 쿠폰", type: "fixed", discount_value: 3000, min_order_amount: 0, max_discount_amount: null, starts_at: "2026-02-01", expires_at: "2026-03-31", max_uses: null, used_count: 512, is_active: true },
  { id: "5", code: "LUNAR2026", name: "설날 이벤트", type: "percent", discount_value: 15, min_order_amount: 50000, max_discount_amount: 15000, starts_at: "2026-01-28", expires_at: "2026-02-05", max_uses: 300, used_count: 300, is_active: false },
];

export default function CouponsPage() {
  const [coupons, setCoupons] = useState(mockCoupons);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    type: "percent" as "fixed" | "percent",
    discount_value: 0,
    min_order_amount: 0,
    max_discount_amount: "",
    starts_at: "",
    expires_at: "",
    max_uses: "",
  });

  function handleDelete(id: string) {
    if (confirm("정말 삭제하시겠습니까?")) {
      setCoupons(coupons.filter((c) => c.id !== id));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newCoupon: Coupon = {
      id: String(coupons.length + 1),
      code: formData.code,
      name: formData.name,
      type: formData.type,
      discount_value: formData.discount_value,
      min_order_amount: formData.min_order_amount,
      max_discount_amount: formData.max_discount_amount ? Number(formData.max_discount_amount) : null,
      starts_at: formData.starts_at,
      expires_at: formData.expires_at,
      max_uses: formData.max_uses ? Number(formData.max_uses) : null,
      used_count: 0,
      is_active: true,
    };
    setCoupons([newCoupon, ...coupons]);
    setShowForm(false);
    setFormData({ code: "", name: "", type: "percent", discount_value: 0, min_order_amount: 0, max_discount_amount: "", starts_at: "", expires_at: "", max_uses: "" });
  }

  const columns: Column<Coupon>[] = [
    {
      key: "code",
      label: "쿠폰코드",
      sortable: true,
      render: (item) => <span className="font-mono font-semibold text-[var(--color-brand-navy)]">{item.code}</span>,
    },
    { key: "name", label: "쿠폰명", sortable: true },
    {
      key: "discount_value",
      label: "할인",
      render: (item) =>
        item.type === "percent" ? `${item.discount_value}%` : `₩${item.discount_value.toLocaleString()}`,
    },
    {
      key: "min_order_amount",
      label: "최소주문",
      render: (item) => `₩${item.min_order_amount.toLocaleString()}`,
    },
    {
      key: "used_count",
      label: "사용/최대",
      render: (item) => `${item.used_count}/${item.max_uses ?? "∞"}`,
    },
    { key: "expires_at", label: "만료일", sortable: true },
    {
      key: "is_active",
      label: "상태",
      render: (item) => (
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${item.is_active ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-500"}`}>
          {item.is_active ? "활성" : "비활성"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "관리",
      render: (item) => (
        <button
          onClick={() => handleDelete(item.id)}
          className="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white hover:opacity-90"
        >
          삭제
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">쿠폰 관리</h1>
          <p className="mt-1 text-sm text-stone-500">전체 쿠폰 {coupons.length}개</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-[var(--color-brand-navy)] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          {showForm ? "취소" : "+ 쿠폰 생성"}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-stone-900">새 쿠폰 생성</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">쿠폰 코드 *</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="예: SPRING2026"
                className="w-full rounded-lg border border-stone-300 px-4 py-2.5 font-mono text-sm uppercase focus:border-[var(--color-brand-navy)] focus:ring-1 focus:ring-[var(--color-brand-navy)] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">쿠폰명 *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="예: 봄 특별 할인"
                className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:border-[var(--color-brand-navy)] focus:ring-1 focus:ring-[var(--color-brand-navy)] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">할인 유형 *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as "fixed" | "percent" })}
                className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:border-[var(--color-brand-navy)] focus:ring-1 focus:ring-[var(--color-brand-navy)] focus:outline-none"
              >
                <option value="percent">정률 (%)</option>
                <option value="fixed">정액 (₩)</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">
                할인값 * {formData.type === "percent" ? "(%)" : "(₩)"}
              </label>
              <input
                type="number"
                required
                min={0}
                value={formData.discount_value || ""}
                onChange={(e) => setFormData({ ...formData, discount_value: Number(e.target.value) })}
                className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:border-[var(--color-brand-navy)] focus:ring-1 focus:ring-[var(--color-brand-navy)] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">최소 주문금액</label>
              <input
                type="number"
                min={0}
                value={formData.min_order_amount || ""}
                onChange={(e) => setFormData({ ...formData, min_order_amount: Number(e.target.value) })}
                className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:border-[var(--color-brand-navy)] focus:ring-1 focus:ring-[var(--color-brand-navy)] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">최대 할인금액</label>
              <input
                type="number"
                min={0}
                value={formData.max_discount_amount}
                onChange={(e) => setFormData({ ...formData, max_discount_amount: e.target.value })}
                placeholder="제한 없음"
                className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:border-[var(--color-brand-navy)] focus:ring-1 focus:ring-[var(--color-brand-navy)] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">시작일 *</label>
              <input
                type="date"
                required
                value={formData.starts_at}
                onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:border-[var(--color-brand-navy)] focus:ring-1 focus:ring-[var(--color-brand-navy)] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">만료일 *</label>
              <input
                type="date"
                required
                value={formData.expires_at}
                onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:border-[var(--color-brand-navy)] focus:ring-1 focus:ring-[var(--color-brand-navy)] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">최대 사용횟수</label>
              <input
                type="number"
                min={1}
                value={formData.max_uses}
                onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
                placeholder="무제한"
                className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:border-[var(--color-brand-navy)] focus:ring-1 focus:ring-[var(--color-brand-navy)] focus:outline-none"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-[var(--color-brand-navy)] px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
            >
              쿠폰 생성
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <DataTable
          columns={columns}
          data={coupons}
          searchPlaceholder="쿠폰코드 또는 쿠폰명 검색..."
          searchKeys={["code", "name"]}
        />
      </div>
    </div>
  );
}
