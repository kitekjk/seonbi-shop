"use client";

import { useState } from "react";
import StatCard from "@/components/admin/stat-card";
import DataTable, { type Column } from "@/components/admin/data-table";

interface ProductSale {
  [key: string]: unknown;
  name: string;
  quantity: number;
  revenue: number;
}

interface SettlementOrder {
  [key: string]: unknown;
  order_number: string;
  customer: string;
  total: number;
  discount: number;
  shipping: number;
  net: number;
  date: string;
}

const mockProductSales: ProductSale[] = [
  { name: "한복 열쇠고리 세트", quantity: 156, revenue: 2340000 },
  { name: "나전칠기 보석함", quantity: 23, revenue: 3588000 },
  { name: "도자기 찻잔 세트", quantity: 45, revenue: 4005000 },
  { name: "전통 부채 (대)", quantity: 67, revenue: 2345000 },
  { name: "한지 노트 (5종)", quantity: 89, revenue: 1958000 },
  { name: "전통 매듭 팔찌", quantity: 112, revenue: 2016000 },
  { name: "서예 붓 세트", quantity: 34, revenue: 1632000 },
  { name: "한지 공예 램프", quantity: 19, revenue: 1425000 },
  { name: "전통 향 세트", quantity: 42, revenue: 1344000 },
  { name: "한복 인형 (신랑신부)", quantity: 28, revenue: 1260000 },
];

const mockOrders: SettlementOrder[] = [
  { order_number: "ORD-20260315-00024", customer: "김민수", total: 65000, discount: 6000, shipping: 3000, net: 62000, date: "2026-03-15" },
  { order_number: "ORD-20260315-00023", customer: "이서연", total: 156000, discount: 0, shipping: 0, net: 156000, date: "2026-03-15" },
  { order_number: "ORD-20260315-00022", customer: "박지훈", total: 89000, discount: 8900, shipping: 3000, net: 83100, date: "2026-03-15" },
  { order_number: "ORD-20260314-00021", customer: "최유나", total: 234000, discount: 23400, shipping: 0, net: 210600, date: "2026-03-14" },
  { order_number: "ORD-20260314-00020", customer: "정현우", total: 48000, discount: 5000, shipping: 3000, net: 46000, date: "2026-03-14" },
  { order_number: "ORD-20260314-00019", customer: "한소희", total: 128000, discount: 12800, shipping: 0, net: 115200, date: "2026-03-14" },
  { order_number: "ORD-20260313-00017", customer: "강다은", total: 45000, discount: 0, shipping: 3000, net: 48000, date: "2026-03-13" },
  { order_number: "ORD-20260313-00015", customer: "배수진", total: 75000, discount: 5000, shipping: 0, net: 70000, date: "2026-03-13" },
];

const summary = {
  total_orders: 180,
  total_sales: 21913000,
  total_discounts: 1842500,
  total_shipping: 324000,
  net_revenue: 20394500,
  commission_rate: 0.03,
  commission_amount: 611835,
  settlement_amount: 19782665,
};

export default function SettlementPage() {
  const [startDate, setStartDate] = useState("2026-03-01");
  const [endDate, setEndDate] = useState("2026-03-15");

  const productColumns: Column<ProductSale>[] = [
    { key: "name", label: "상품명", sortable: true },
    { key: "quantity", label: "판매수량", sortable: true },
    {
      key: "revenue",
      label: "매출액",
      sortable: true,
      render: (item) => `₩${item.revenue.toLocaleString()}`,
    },
  ];

  const orderColumns: Column<SettlementOrder>[] = [
    { key: "order_number", label: "주문번호", sortable: true },
    { key: "customer", label: "고객명" },
    {
      key: "total",
      label: "상품금액",
      sortable: true,
      render: (item) => `₩${item.total.toLocaleString()}`,
    },
    {
      key: "discount",
      label: "할인",
      render: (item) => item.discount > 0 ? <span className="text-red-600">-₩{item.discount.toLocaleString()}</span> : "-",
    },
    {
      key: "shipping",
      label: "배송비",
      render: (item) => item.shipping > 0 ? `₩${item.shipping.toLocaleString()}` : "무료",
    },
    {
      key: "net",
      label: "결제금액",
      sortable: true,
      render: (item) => <span className="font-semibold">₩{item.net.toLocaleString()}</span>,
    },
    { key: "date", label: "주문일", sortable: true },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">정산 관리</h1>
          <p className="mt-1 text-sm text-stone-500">매출 및 정산 현황</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-[var(--color-brand-navy)] focus:outline-none"
          />
          <span className="text-stone-400">~</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-[var(--color-brand-navy)] focus:outline-none"
          />
          <button className="rounded-lg bg-[var(--color-brand-navy)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity">
            조회
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="총 주문"
          value={`${summary.total_orders}건`}
          icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
        />
        <StatCard
          title="총 매출"
          value={`₩${summary.total_sales.toLocaleString()}`}
          icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard
          title="순매출"
          value={`₩${summary.net_revenue.toLocaleString()}`}
          change={`할인 ₩${summary.total_discounts.toLocaleString()}`}
          changeType="neutral"
          icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
        />
        <StatCard
          title="정산금액"
          value={`₩${summary.settlement_amount.toLocaleString()}`}
          change={`수수료 ${(summary.commission_rate * 100).toFixed(0)}% (₩${summary.commission_amount.toLocaleString()})`}
          changeType="negative"
          icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
        />
      </div>

      {/* Settlement Detail */}
      <div className="mt-6 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-lg font-semibold text-stone-900">정산 상세</h2>
        <div className="mb-4 grid grid-cols-2 gap-4 rounded-lg bg-stone-50 p-4 md:grid-cols-5">
          <div>
            <p className="text-xs font-medium text-stone-500">총 매출</p>
            <p className="mt-0.5 text-sm font-bold text-stone-900">₩{summary.total_sales.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-stone-500">총 할인</p>
            <p className="mt-0.5 text-sm font-bold text-red-600">-₩{summary.total_discounts.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-stone-500">배송비 수입</p>
            <p className="mt-0.5 text-sm font-bold text-stone-900">₩{summary.total_shipping.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-stone-500">수수료 ({(summary.commission_rate * 100).toFixed(0)}%)</p>
            <p className="mt-0.5 text-sm font-bold text-red-600">-₩{summary.commission_amount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-stone-500">최종 정산</p>
            <p className="mt-0.5 text-sm font-bold text-green-700">₩{summary.settlement_amount.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Product Sales */}
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-stone-900">상품별 매출</h2>
          <DataTable
            columns={productColumns}
            data={mockProductSales}
            searchPlaceholder="상품명 검색..."
            searchKeys={["name"]}
            pageSize={5}
          />
        </div>

        {/* Order Details */}
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-stone-900">주문별 상세</h2>
          <DataTable
            columns={orderColumns}
            data={mockOrders}
            searchPlaceholder="주문번호 검색..."
            searchKeys={["order_number", "customer"]}
            pageSize={5}
          />
        </div>
      </div>
    </div>
  );
}
