"use client";

import Link from "next/link";
import { useState } from "react";
import DataTable, { type Column } from "@/components/admin/data-table";
import StatusSelect from "@/components/admin/status-select";

interface Order {
  [key: string]: unknown;
  id: string;
  order_number: string;
  customer: string;
  phone: string;
  items_summary: string;
  final_amount: number;
  status: string;
  created_at: string;
}

const statusOptions = [
  { value: "payment_completed", label: "결제완료", color: "#2563eb" },
  { value: "preparing", label: "준비중", color: "#d97706" },
  { value: "shipping", label: "배송중", color: "#7c3aed" },
  { value: "delivered", label: "배송완료", color: "#16a34a" },
  { value: "cancelled", label: "취소", color: "#dc2626" },
];

const statusLabels: Record<string, string> = {
  payment_completed: "결제완료",
  preparing: "준비중",
  shipping: "배송중",
  delivered: "배송완료",
  cancelled: "취소",
};

const mockOrders: Order[] = [
  { id: "1", order_number: "ORD-20260315-00024", customer: "김민수", phone: "010-1234-5678", items_summary: "한복 열쇠고리 세트 외 1건", final_amount: 89000, status: "payment_completed", created_at: "2026-03-15 14:23" },
  { id: "2", order_number: "ORD-20260315-00023", customer: "이서연", phone: "010-2345-6789", items_summary: "나전칠기 보석함", final_amount: 156000, status: "shipping", created_at: "2026-03-15 13:15" },
  { id: "3", order_number: "ORD-20260315-00022", customer: "박지훈", phone: "010-3456-7890", items_summary: "도자기 찻잔 세트", final_amount: 45000, status: "preparing", created_at: "2026-03-15 11:42" },
  { id: "4", order_number: "ORD-20260314-00021", customer: "최유나", phone: "010-4567-8901", items_summary: "전통 부채 (대) 외 2건", final_amount: 234000, status: "delivered", created_at: "2026-03-14 18:30" },
  { id: "5", order_number: "ORD-20260314-00020", customer: "정현우", phone: "010-5678-9012", items_summary: "서예 붓 세트", final_amount: 67500, status: "payment_completed", created_at: "2026-03-14 16:05" },
  { id: "6", order_number: "ORD-20260314-00019", customer: "한소희", phone: "010-6789-0123", items_summary: "한지 노트 (5종) 외 1건", final_amount: 128000, status: "preparing", created_at: "2026-03-14 14:50" },
  { id: "7", order_number: "ORD-20260314-00018", customer: "윤재호", phone: "010-7890-1234", items_summary: "전통 매듭 팔찌", final_amount: 92000, status: "shipping", created_at: "2026-03-14 12:10" },
  { id: "8", order_number: "ORD-20260313-00017", customer: "강다은", phone: "010-8901-2345", items_summary: "한복 인형 (신랑신부)", final_amount: 45000, status: "delivered", created_at: "2026-03-13 17:20" },
  { id: "9", order_number: "ORD-20260313-00016", customer: "조성준", phone: "010-9012-3456", items_summary: "전통 향 세트 외 1건", final_amount: 64000, status: "cancelled", created_at: "2026-03-13 15:45" },
  { id: "10", order_number: "ORD-20260313-00015", customer: "배수진", phone: "010-0123-4567", items_summary: "한지 공예 램프", final_amount: 75000, status: "delivered", created_at: "2026-03-13 10:30" },
  { id: "11", order_number: "ORD-20260312-00014", customer: "임도현", phone: "010-1111-2222", items_summary: "전통 문양 머그컵 외 3건", final_amount: 182000, status: "delivered", created_at: "2026-03-12 09:15" },
  { id: "12", order_number: "ORD-20260312-00013", customer: "송하은", phone: "010-3333-4444", items_summary: "전통 자수 손수건", final_amount: 12000, status: "delivered", created_at: "2026-03-12 08:00" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState(mockOrders);
  const [statusFilter, setStatusFilter] = useState("all");

  function handleStatusChange(orderId: string, newStatus: string) {
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
  }

  const filtered = statusFilter === "all" ? orders : orders.filter((o) => o.status === statusFilter);

  const columns: Column<Order>[] = [
    {
      key: "order_number",
      label: "주문번호",
      sortable: true,
      render: (item) => (
        <Link href={`/admin/orders/${item.id}`} className="font-medium text-[var(--color-brand-navy)] hover:underline">
          {item.order_number}
        </Link>
      ),
    },
    { key: "customer", label: "고객명", sortable: true },
    { key: "items_summary", label: "주문상품" },
    {
      key: "final_amount",
      label: "결제금액",
      sortable: true,
      render: (item) => `₩${item.final_amount.toLocaleString()}`,
    },
    {
      key: "status",
      label: "상태",
      render: (item) => (
        <StatusSelect
          value={item.status}
          options={statusOptions}
          onChange={(v) => handleStatusChange(item.id, v)}
        />
      ),
    },
    { key: "created_at", label: "주문일시", sortable: true },
    {
      key: "actions",
      label: "",
      render: (item) => (
        <Link
          href={`/admin/orders/${item.id}`}
          className="text-sm text-stone-500 hover:text-[var(--color-brand-navy)]"
        >
          상세 →
        </Link>
      ),
    },
  ];

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-stone-900">주문 관리</h1>
        <p className="mt-1 text-sm text-stone-500">전체 주문 {orders.length}건</p>
      </div>

      {/* Status Filter */}
      <div className="mt-6 flex gap-2 flex-wrap">
        <button
          onClick={() => setStatusFilter("all")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            statusFilter === "all" ? "bg-[var(--color-brand-navy)] text-white" : "bg-white text-stone-600 border border-stone-300 hover:bg-stone-50"
          }`}
        >
          전체 ({orders.length})
        </button>
        {statusOptions.map((opt) => {
          const count = orders.filter((o) => o.status === opt.value).length;
          return (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                statusFilter === opt.value ? "bg-[var(--color-brand-navy)] text-white" : "bg-white text-stone-600 border border-stone-300 hover:bg-stone-50"
              }`}
            >
              {opt.label} ({count})
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <DataTable
          columns={columns}
          data={filtered}
          searchPlaceholder="주문번호 또는 고객명 검색..."
          searchKeys={["order_number", "customer"]}
        />
      </div>
    </div>
  );
}
