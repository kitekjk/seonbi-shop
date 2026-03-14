"use client";

import Link from "next/link";
import { useState } from "react";

interface ProductOption {
  name: string;
  additional_price: number;
  stock: number;
}

const mockProduct = {
  name: "한복 열쇠고리 세트",
  slug: "hanbok-keyring-set",
  category: "소품",
  base_price: 15000,
  is_active: true,
  description: "전통 한복 디자인의 귀여운 열쇠고리 세트입니다.",
  detail_html: "<p>정교하게 수작업으로 제작된 한복 열쇠고리입니다.</p><p>선물용으로도 좋습니다.</p>",
  options: [
    { name: "빨강", additional_price: 0, stock: 40 },
    { name: "파랑", additional_price: 0, stock: 35 },
    { name: "분홍", additional_price: 2000, stock: 45 },
  ],
  tags: ["한복", "열쇠고리", "선물", "전통"],
};

export default function EditProductPage() {
  const [name, setName] = useState(mockProduct.name);
  const [slug, setSlug] = useState(mockProduct.slug);
  const [category, setCategory] = useState(mockProduct.category);
  const [basePrice, setBasePrice] = useState(mockProduct.base_price);
  const [isActive, setIsActive] = useState(mockProduct.is_active);
  const [description, setDescription] = useState(mockProduct.description);
  const [detailHtml, setDetailHtml] = useState(mockProduct.detail_html);
  const [options, setOptions] = useState<ProductOption[]>(mockProduct.options);
  const [tags, setTags] = useState<string[]>(mockProduct.tags);
  const [tagInput, setTagInput] = useState("");

  function addOption() {
    setOptions([...options, { name: "", additional_price: 0, stock: 0 }]);
  }

  function removeOption(index: number) {
    setOptions(options.filter((_, i) => i !== index));
  }

  function updateOption(index: number, field: keyof ProductOption, value: string | number) {
    const updated = [...options];
    updated[index] = { ...updated[index], [field]: value };
    setOptions(updated);
  }

  function addTag() {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
      setTagInput("");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert("상품이 수정되었습니다. (데모)");
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="text-stone-400 hover:text-stone-600">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-stone-900">상품 수정</h1>
          <p className="mt-1 text-sm text-stone-500">{mockProduct.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Basic Info */}
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-stone-900">기본 정보</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-stone-700">상품명 *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:border-[var(--color-brand-navy)] focus:ring-1 focus:ring-[var(--color-brand-navy)] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">슬러그 *</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:border-[var(--color-brand-navy)] focus:ring-1 focus:ring-[var(--color-brand-navy)] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">카테고리</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:border-[var(--color-brand-navy)] focus:ring-1 focus:ring-[var(--color-brand-navy)] focus:outline-none"
              >
                <option value="">선택하세요</option>
                <option value="소품">소품</option>
                <option value="전통공예">전통공예</option>
                <option value="도자기">도자기</option>
                <option value="한지">한지</option>
                <option value="문구">문구</option>
                <option value="생활">생활</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">기본가격 *</label>
              <input
                type="number"
                required
                min={0}
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:border-[var(--color-brand-navy)] focus:ring-1 focus:ring-[var(--color-brand-navy)] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">상태</label>
              <select
                value={String(isActive)}
                onChange={(e) => setIsActive(e.target.value === "true")}
                className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:border-[var(--color-brand-navy)] focus:ring-1 focus:ring-[var(--color-brand-navy)] focus:outline-none"
              >
                <option value="true">판매중</option>
                <option value="false">비활성</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-stone-700">간단 설명</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:border-[var(--color-brand-navy)] focus:ring-1 focus:ring-[var(--color-brand-navy)] focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-stone-700">상세 설명 (HTML)</label>
              <textarea
                rows={6}
                value={detailHtml}
                onChange={(e) => setDetailHtml(e.target.value)}
                className="w-full rounded-lg border border-stone-300 px-4 py-2.5 font-mono text-sm focus:border-[var(--color-brand-navy)] focus:ring-1 focus:ring-[var(--color-brand-navy)] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-stone-900">옵션</h2>
            <button
              type="button"
              onClick={addOption}
              className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-medium text-stone-700 hover:bg-stone-50"
            >
              + 옵션 추가
            </button>
          </div>
          {options.length === 0 ? (
            <p className="mt-4 text-sm text-stone-500">옵션이 없습니다.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {options.map((opt, i) => (
                <div key={i} className="flex items-end gap-3 rounded-lg bg-stone-50 p-3">
                  <div className="flex-1">
                    <label className="mb-1 block text-xs font-medium text-stone-600">옵션명</label>
                    <input
                      type="text"
                      value={opt.name}
                      onChange={(e) => updateOption(i, "name", e.target.value)}
                      className="w-full rounded border border-stone-300 px-3 py-2 text-sm focus:border-[var(--color-brand-navy)] focus:outline-none"
                    />
                  </div>
                  <div className="w-32">
                    <label className="mb-1 block text-xs font-medium text-stone-600">추가금</label>
                    <input
                      type="number"
                      value={opt.additional_price}
                      onChange={(e) => updateOption(i, "additional_price", Number(e.target.value))}
                      className="w-full rounded border border-stone-300 px-3 py-2 text-sm focus:border-[var(--color-brand-navy)] focus:outline-none"
                    />
                  </div>
                  <div className="w-24">
                    <label className="mb-1 block text-xs font-medium text-stone-600">재고</label>
                    <input
                      type="number"
                      value={opt.stock}
                      onChange={(e) => updateOption(i, "stock", Number(e.target.value))}
                      className="w-full rounded border border-stone-300 px-3 py-2 text-sm focus:border-[var(--color-brand-navy)] focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeOption(i)}
                    className="rounded p-2 text-red-500 hover:bg-red-50"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-stone-900">태그</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              placeholder="태그 입력 후 Enter"
              className="flex-1 rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:border-[var(--color-brand-navy)] focus:ring-1 focus:ring-[var(--color-brand-navy)] focus:outline-none"
            />
            <button
              type="button"
              onClick={addTag}
              className="rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50"
            >
              추가
            </button>
          </div>
          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-[var(--color-brand-navy)]/10 px-3 py-1 text-sm text-[var(--color-brand-navy)]">
                  {tag}
                  <button type="button" onClick={() => setTags(tags.filter((t) => t !== tag))} className="hover:text-red-600">
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Link
            href="/admin/products"
            className="rounded-lg border border-stone-300 px-6 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50"
          >
            취소
          </Link>
          <button
            type="submit"
            className="rounded-lg bg-[var(--color-brand-navy)] px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            변경사항 저장
          </button>
        </div>
      </form>
    </div>
  );
}
