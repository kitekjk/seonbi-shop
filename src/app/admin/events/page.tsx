"use client";

import { useState } from "react";
import DataTable, { type Column } from "@/components/admin/data-table";

interface Event {
  [key: string]: unknown;
  id: string;
  title: string;
  slug: string;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
  coupons: string[];
}

const mockEvents: Event[] = [
  { id: "1", title: "2026 봄맞이 대축제", slug: "spring-2026", starts_at: "2026-03-01", ends_at: "2026-04-30", is_active: true, coupons: ["SPRING5000"] },
  { id: "2", title: "선비샵 1주년 기념", slug: "1st-anniversary", starts_at: "2026-05-01", ends_at: "2026-05-31", is_active: false, coupons: ["VIP20", "FREESHIP"] },
  { id: "3", title: "설날 특별 이벤트", slug: "lunar-2026", starts_at: "2026-01-28", ends_at: "2026-02-05", is_active: false, coupons: ["LUNAR2026"] },
  { id: "4", title: "화이트데이 선물 기획전", slug: "white-day-2026", starts_at: "2026-03-10", ends_at: "2026-03-14", is_active: true, coupons: [] },
];

export default function EventsPage() {
  const [events, setEvents] = useState(mockEvents);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    image_url: "",
    starts_at: "",
    ends_at: "",
  });

  function handleDelete(id: string) {
    if (confirm("정말 삭제하시겠습니까?")) {
      setEvents(events.filter((e) => e.id !== id));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newEvent: Event = {
      id: String(events.length + 1),
      title: formData.title,
      slug: formData.slug,
      starts_at: formData.starts_at,
      ends_at: formData.ends_at,
      is_active: true,
      coupons: [],
    };
    setEvents([newEvent, ...events]);
    setShowForm(false);
    setFormData({ title: "", slug: "", description: "", image_url: "", starts_at: "", ends_at: "" });
  }

  function getStatusBadge(event: Event) {
    const now = new Date();
    const start = new Date(event.starts_at);
    const end = new Date(event.ends_at);
    if (now < start) return <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">예정</span>;
    if (now > end) return <span className="inline-flex rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-semibold text-stone-500">종료</span>;
    return <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">진행중</span>;
  }

  const columns: Column<Event>[] = [
    { key: "title", label: "이벤트명", sortable: true },
    { key: "slug", label: "슬러그" },
    { key: "starts_at", label: "시작일", sortable: true },
    { key: "ends_at", label: "종료일", sortable: true },
    {
      key: "status",
      label: "상태",
      render: (item) => getStatusBadge(item),
    },
    {
      key: "coupons",
      label: "연결 쿠폰",
      render: (item) =>
        item.coupons.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {item.coupons.map((c) => (
              <span key={c} className="rounded bg-[var(--color-brand-gold)]/10 px-2 py-0.5 text-xs font-mono font-medium text-[var(--color-brand-gold)]">
                {c}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-stone-400">-</span>
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
          <h1 className="text-2xl font-bold text-stone-900">이벤트 관리</h1>
          <p className="mt-1 text-sm text-stone-500">전체 이벤트 {events.length}개</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-[var(--color-brand-navy)] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          {showForm ? "취소" : "+ 이벤트 생성"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-stone-900">새 이벤트 생성</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-stone-700">이벤트명 *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="예: 2026 여름 세일"
                className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:border-[var(--color-brand-navy)] focus:ring-1 focus:ring-[var(--color-brand-navy)] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">슬러그 *</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="예: summer-2026"
                className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:border-[var(--color-brand-navy)] focus:ring-1 focus:ring-[var(--color-brand-navy)] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">이미지 URL</label>
              <input
                type="text"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://..."
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
              <label className="mb-1.5 block text-sm font-medium text-stone-700">종료일 *</label>
              <input
                type="date"
                required
                value={formData.ends_at}
                onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
                className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:border-[var(--color-brand-navy)] focus:ring-1 focus:ring-[var(--color-brand-navy)] focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-stone-700">설명</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="이벤트에 대한 설명"
                className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:border-[var(--color-brand-navy)] focus:ring-1 focus:ring-[var(--color-brand-navy)] focus:outline-none"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-[var(--color-brand-navy)] px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
            >
              이벤트 생성
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <DataTable
          columns={columns}
          data={events}
          searchPlaceholder="이벤트명 검색..."
          searchKeys={["title", "slug"]}
        />
      </div>
    </div>
  );
}
