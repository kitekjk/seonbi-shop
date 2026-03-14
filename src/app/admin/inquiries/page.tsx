"use client";

import { useState } from "react";
import DataTable, { type Column } from "@/components/admin/data-table";

interface Inquiry {
  [key: string]: unknown;
  id: string;
  customer: string;
  type: string;
  title: string;
  content: string;
  status: string;
  created_at: string;
  replies: { content: string; created_at: string }[];
}

const typeLabels: Record<string, string> = {
  product: "상품문의",
  shipping: "배송문의",
  general: "일반문의",
};

const typeColors: Record<string, string> = {
  product: "bg-blue-100 text-blue-700",
  shipping: "bg-purple-100 text-purple-700",
  general: "bg-stone-100 text-stone-700",
};

const statusLabels: Record<string, string> = {
  pending: "대기중",
  answered: "답변완료",
  closed: "종료",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  answered: "bg-green-100 text-green-700",
  closed: "bg-stone-100 text-stone-500",
};

const mockInquiries: Inquiry[] = [
  { id: "1", customer: "김민수", type: "product", title: "한복 열쇠고리 색상 문의", content: "파랑색 외에 다른 색상도 있나요?", status: "pending", created_at: "2026-03-15 10:30", replies: [] },
  { id: "2", customer: "이서연", type: "shipping", title: "배송 지연 문의", content: "주문한지 5일이 되었는데 아직 배송이 시작되지 않았습니다.", status: "pending", created_at: "2026-03-14 16:45", replies: [] },
  { id: "3", customer: "박지훈", type: "general", title: "교환/반품 절차", content: "구매한 도자기 찻잔에 기스가 있어서 교환하고 싶습니다.", status: "answered", created_at: "2026-03-14 11:20", replies: [{ content: "안녕하세요, 고객님. 불편을 드려 죄송합니다. 반품 택배를 보내드리겠습니다.", created_at: "2026-03-14 14:00" }] },
  { id: "4", customer: "최유나", type: "product", title: "나전칠기 보석함 재입고", content: "품절된 나전칠기 보석함은 언제 재입고 되나요?", status: "answered", created_at: "2026-03-13 09:15", replies: [{ content: "3월 말 재입고 예정입니다. 입고 시 알림 드리겠습니다.", created_at: "2026-03-13 11:30" }] },
  { id: "5", customer: "정현우", type: "shipping", title: "선물 포장 가능 여부", content: "선물용으로 구매하려는데 포장 서비스가 있나요?", status: "pending", created_at: "2026-03-13 08:00", replies: [] },
  { id: "6", customer: "한소희", type: "general", title: "대량 구매 할인", content: "기업 선물용으로 50개 이상 주문하면 할인이 가능한가요?", status: "closed", created_at: "2026-03-12 15:30", replies: [{ content: "대량 구매 시 10% 할인 적용 가능합니다. 상세 견적을 이메일로 보내드리겠습니다.", created_at: "2026-03-12 17:00" }] },
  { id: "7", customer: "윤재호", type: "product", title: "서예 붓 세트 구성품", content: "서예 붓 세트에 먹물도 포함되어 있나요?", status: "pending", created_at: "2026-03-12 14:20", replies: [] },
];

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState(mockInquiries);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const selected = inquiries.find((i) => i.id === selectedId);

  function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId || !replyContent.trim()) return;
    setInquiries(
      inquiries.map((i) =>
        i.id === selectedId
          ? {
              ...i,
              status: "answered",
              replies: [...i.replies, { content: replyContent, created_at: new Date().toISOString().slice(0, 16).replace("T", " ") }],
            }
          : i
      )
    );
    setReplyContent("");
  }

  let filtered = inquiries;
  if (statusFilter !== "all") filtered = filtered.filter((i) => i.status === statusFilter);
  if (typeFilter !== "all") filtered = filtered.filter((i) => i.type === typeFilter);

  const columns: Column<Inquiry>[] = [
    {
      key: "type",
      label: "유형",
      render: (item) => (
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${typeColors[item.type] ?? ""}`}>
          {typeLabels[item.type] ?? item.type}
        </span>
      ),
    },
    {
      key: "title",
      label: "제목",
      sortable: true,
      render: (item) => (
        <button
          onClick={() => setSelectedId(item.id)}
          className="text-left font-medium text-[var(--color-brand-navy)] hover:underline"
        >
          {item.title}
        </button>
      ),
    },
    { key: "customer", label: "고객명", sortable: true },
    {
      key: "status",
      label: "상태",
      render: (item) => (
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[item.status] ?? ""}`}>
          {statusLabels[item.status] ?? item.status}
        </span>
      ),
    },
    { key: "created_at", label: "등록일", sortable: true },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900">문의 관리</h1>
      <p className="mt-1 text-sm text-stone-500">
        전체 {inquiries.length}건 · 미답변 {inquiries.filter((i) => i.status === "pending").length}건
      </p>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-stone-600">상태:</span>
          <div className="flex gap-1">
            {[{ value: "all", label: "전체" }, { value: "pending", label: "대기중" }, { value: "answered", label: "답변완료" }, { value: "closed", label: "종료" }].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  statusFilter === opt.value ? "bg-[var(--color-brand-navy)] text-white" : "bg-white text-stone-600 border border-stone-300 hover:bg-stone-50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-stone-600">유형:</span>
          <div className="flex gap-1">
            {[{ value: "all", label: "전체" }, { value: "product", label: "상품" }, { value: "shipping", label: "배송" }, { value: "general", label: "일반" }].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTypeFilter(opt.value)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  typeFilter === opt.value ? "bg-[var(--color-brand-navy)] text-white" : "bg-white text-stone-600 border border-stone-300 hover:bg-stone-50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-6 xl:grid-cols-5">
        {/* Inquiry List */}
        <div className="xl:col-span-3 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <DataTable
            columns={columns}
            data={filtered}
            searchPlaceholder="제목 또는 고객명 검색..."
            searchKeys={["title", "customer"]}
            pageSize={7}
          />
        </div>

        {/* Detail / Reply */}
        <div className="xl:col-span-2 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          {selected ? (
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${typeColors[selected.type] ?? ""}`}>
                    {typeLabels[selected.type]}
                  </span>
                  <h2 className="mt-2 text-lg font-semibold text-stone-900">{selected.title}</h2>
                  <p className="mt-0.5 text-sm text-stone-500">{selected.customer} · {selected.created_at}</p>
                </div>
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[selected.status] ?? ""}`}>
                  {statusLabels[selected.status]}
                </span>
              </div>

              <div className="mt-4 rounded-lg bg-stone-50 p-4">
                <p className="text-sm text-stone-700 whitespace-pre-wrap">{selected.content}</p>
              </div>

              {/* Existing replies */}
              {selected.replies.length > 0 && (
                <div className="mt-4 space-y-3">
                  {selected.replies.map((reply, i) => (
                    <div key={i} className="rounded-lg bg-[var(--color-brand-navy)]/5 p-4">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-[var(--color-brand-navy)] px-1.5 py-0.5 text-xs font-medium text-white">관리자</span>
                        <span className="text-xs text-stone-500">{reply.created_at}</span>
                      </div>
                      <p className="mt-2 text-sm text-stone-700 whitespace-pre-wrap">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply form */}
              {selected.status !== "closed" && (
                <form onSubmit={handleReply} className="mt-4">
                  <textarea
                    rows={3}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="답변을 작성하세요..."
                    className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:border-[var(--color-brand-navy)] focus:ring-1 focus:ring-[var(--color-brand-navy)] focus:outline-none"
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={!replyContent.trim()}
                      className="rounded-lg bg-[var(--color-brand-navy)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
                    >
                      답변 등록
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center py-16 text-center">
              <div>
                <svg className="mx-auto h-12 w-12 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <p className="mt-2 text-sm text-stone-500">문의를 선택하면 상세 내용이 표시됩니다.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
