"use client";

import StatCard from "@/components/admin/stat-card";
import DataTable, { type Column } from "@/components/admin/data-table";

const stats = [
  {
    title: "오늘 매출",
    value: "₩1,248,000",
    change: "+12.5% 전일 대비",
    changeType: "positive" as const,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "오늘 주문",
    value: "24건",
    change: "+3건 전일 대비",
    changeType: "positive" as const,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    title: "미처리 문의",
    value: "7건",
    change: "2건 긴급",
    changeType: "negative" as const,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
  {
    title: "배송 준비중",
    value: "12건",
    change: "평균 처리 1.2일",
    changeType: "neutral" as const,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a2 2 0 104 0m-4 0a2 2 0 114 0m-10 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    ),
  },
];

interface RecentOrder {
  [key: string]: unknown;
  id: string;
  order_number: string;
  customer: string;
  amount: string;
  status: string;
  date: string;
}

const recentOrders: RecentOrder[] = [
  { id: "1", order_number: "ORD-20260315-00024", customer: "김민수", amount: "₩89,000", status: "결제완료", date: "2026-03-15 14:23" },
  { id: "2", order_number: "ORD-20260315-00023", customer: "이서연", amount: "₩156,000", status: "배송중", date: "2026-03-15 13:15" },
  { id: "3", order_number: "ORD-20260315-00022", customer: "박지훈", amount: "₩45,000", status: "준비중", date: "2026-03-15 11:42" },
  { id: "4", order_number: "ORD-20260314-00021", customer: "최유나", amount: "₩234,000", status: "배송완료", date: "2026-03-14 18:30" },
  { id: "5", order_number: "ORD-20260314-00020", customer: "정현우", amount: "₩67,500", status: "결제완료", date: "2026-03-14 16:05" },
  { id: "6", order_number: "ORD-20260314-00019", customer: "한소희", amount: "₩128,000", status: "준비중", date: "2026-03-14 14:50" },
  { id: "7", order_number: "ORD-20260314-00018", customer: "윤재호", amount: "₩92,000", status: "배송중", date: "2026-03-14 12:10" },
];

const statusColors: Record<string, string> = {
  결제완료: "bg-blue-100 text-blue-700",
  준비중: "bg-yellow-100 text-yellow-700",
  배송중: "bg-purple-100 text-purple-700",
  배송완료: "bg-green-100 text-green-700",
  취소: "bg-red-100 text-red-700",
};

const orderColumns: Column<RecentOrder>[] = [
  { key: "order_number", label: "주문번호", sortable: true },
  { key: "customer", label: "고객명", sortable: true },
  { key: "amount", label: "결제금액", sortable: true },
  {
    key: "status",
    label: "상태",
    render: (item) => (
      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[item.status] ?? "bg-stone-100 text-stone-700"}`}>
        {item.status}
      </span>
    ),
  },
  { key: "date", label: "주문일시", sortable: true },
];

const orderStatusSummary = [
  { label: "결제완료", count: 8, color: "bg-blue-500" },
  { label: "준비중", count: 12, color: "bg-yellow-500" },
  { label: "배송중", count: 15, color: "bg-purple-500" },
  { label: "배송완료", count: 142, color: "bg-green-500" },
  { label: "취소", count: 3, color: "bg-red-500" },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900">대시보드</h1>
      <p className="mt-1 text-sm text-stone-500">선비샵 운영 현황을 한눈에 확인하세요.</p>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Recent Orders */}
        <div className="xl:col-span-2 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-stone-900">최근 주문</h2>
          <DataTable
            columns={orderColumns}
            data={recentOrders}
            searchPlaceholder="주문번호 또는 고객명 검색..."
            searchKeys={["order_number", "customer"]}
            pageSize={5}
          />
        </div>

        {/* Order Status Summary */}
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-stone-900">주문 상태 현황</h2>
          <div className="space-y-4">
            {orderStatusSummary.map((item) => {
              const total = orderStatusSummary.reduce((s, i) => s + i.count, 0);
              const pct = Math.round((item.count / total) * 100);
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-stone-700">{item.label}</span>
                    <span className="text-stone-500">{item.count}건 ({pct}%)</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full rounded-full bg-stone-100">
                    <div
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-lg bg-stone-50 p-4">
            <p className="text-sm font-medium text-stone-700">이번 달 총 주문</p>
            <p className="mt-1 text-2xl font-bold text-stone-900">180건</p>
            <p className="mt-0.5 text-sm text-green-600">+15.2% 전월 대비</p>
          </div>
        </div>
      </div>
    </div>
  );
}
