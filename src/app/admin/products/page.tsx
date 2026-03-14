"use client";

import Link from "next/link";
import { useState } from "react";
import DataTable, { type Column } from "@/components/admin/data-table";

interface Product {
  [key: string]: unknown;
  id: string;
  name: string;
  category: string;
  base_price: number;
  stock: number;
  is_active: boolean;
  created_at: string;
}

const mockProducts: Product[] = [
  { id: "1", name: "한복 열쇠고리 세트", category: "소품", base_price: 15000, stock: 120, is_active: true, created_at: "2026-02-10" },
  { id: "2", name: "전통 부채 (대)", category: "전통공예", base_price: 35000, stock: 45, is_active: true, created_at: "2026-02-08" },
  { id: "3", name: "도자기 찻잔 세트", category: "도자기", base_price: 89000, stock: 30, is_active: true, created_at: "2026-01-25" },
  { id: "4", name: "한지 노트 (5종)", category: "한지", base_price: 22000, stock: 200, is_active: true, created_at: "2026-01-20" },
  { id: "5", name: "전통 매듭 팔찌", category: "소품", base_price: 18000, stock: 85, is_active: true, created_at: "2026-01-15" },
  { id: "6", name: "나전칠기 보석함", category: "전통공예", base_price: 156000, stock: 12, is_active: true, created_at: "2026-01-10" },
  { id: "7", name: "전통 문양 머그컵", category: "도자기", base_price: 28000, stock: 65, is_active: false, created_at: "2025-12-20" },
  { id: "8", name: "한복 인형 (신랑신부)", category: "소품", base_price: 45000, stock: 35, is_active: true, created_at: "2025-12-15" },
  { id: "9", name: "전통 향 세트", category: "생활", base_price: 32000, stock: 90, is_active: true, created_at: "2025-12-10" },
  { id: "10", name: "서예 붓 세트", category: "문구", base_price: 48000, stock: 25, is_active: true, created_at: "2025-12-05" },
  { id: "11", name: "한지 공예 램프", category: "한지", base_price: 75000, stock: 18, is_active: true, created_at: "2025-11-28" },
  { id: "12", name: "전통 자수 손수건", category: "소품", base_price: 12000, stock: 150, is_active: false, created_at: "2025-11-20" },
];

export default function ProductsPage() {
  const [products, setProducts] = useState(mockProducts);

  function handleDelete(id: string) {
    if (confirm("정말 삭제하시겠습니까?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  }

  const columns: Column<Product>[] = [
    { key: "name", label: "상품명", sortable: true },
    { key: "category", label: "카테고리", sortable: true },
    {
      key: "base_price",
      label: "가격",
      sortable: true,
      render: (item) => `₩${item.base_price.toLocaleString()}`,
    },
    {
      key: "stock",
      label: "재고",
      sortable: true,
      render: (item) => (
        <span className={item.stock < 20 ? "font-semibold text-red-600" : ""}>
          {item.stock}
        </span>
      ),
    },
    {
      key: "is_active",
      label: "상태",
      render: (item) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            item.is_active ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-500"
          }`}
        >
          {item.is_active ? "판매중" : "비활성"}
        </span>
      ),
    },
    { key: "created_at", label: "등록일", sortable: true },
    {
      key: "actions",
      label: "관리",
      render: (item) => (
        <div className="flex gap-2">
          <Link
            href={`/admin/products/${item.id}/edit`}
            className="rounded bg-[var(--color-brand-navy)] px-3 py-1 text-xs font-medium text-white hover:opacity-90"
          >
            수정
          </Link>
          <button
            onClick={() => handleDelete(item.id)}
            className="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white hover:opacity-90"
          >
            삭제
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">상품 관리</h1>
          <p className="mt-1 text-sm text-stone-500">전체 상품 {products.length}개</p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-[var(--color-brand-navy)] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          + 상품 등록
        </Link>
      </div>

      <div className="mt-6 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <DataTable
          columns={columns}
          data={products}
          searchPlaceholder="상품명 또는 카테고리 검색..."
          searchKeys={["name", "category"]}
        />
      </div>
    </div>
  );
}
