"use client";

import { useState } from "react";

interface AddressData {
  label: string;
  recipientName: string;
  phone: string;
  postalCode: string;
  addressLine1: string;
  addressLine2: string;
  isDefault: boolean;
}

interface AddressFormProps {
  initialData?: Partial<AddressData>;
  onSubmit?: (data: AddressData) => void;
  onCancel?: () => void;
}

export function AddressForm({ initialData, onSubmit, onCancel }: AddressFormProps) {
  const [form, setForm] = useState<AddressData>({
    label: initialData?.label ?? "",
    recipientName: initialData?.recipientName ?? "",
    phone: initialData?.phone ?? "",
    postalCode: initialData?.postalCode ?? "",
    addressLine1: initialData?.addressLine1 ?? "",
    addressLine2: initialData?.addressLine2 ?? "",
    isDefault: initialData?.isDefault ?? false,
  });

  const handleChange = (field: keyof AddressData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API call to save address
    onSubmit?.(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-stone-700">
          배송지명
        </label>
        <input
          type="text"
          value={form.label}
          onChange={(e) => handleChange("label", e.target.value)}
          placeholder="예: 집, 회사"
          className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700">
            수령인
          </label>
          <input
            type="text"
            value={form.recipientName}
            onChange={(e) => handleChange("recipientName", e.target.value)}
            placeholder="이름"
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700">
            연락처
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="010-0000-0000"
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700">
          우편번호
        </label>
        <div className="mt-1 flex gap-2">
          <input
            type="text"
            value={form.postalCode}
            onChange={(e) => handleChange("postalCode", e.target.value)}
            placeholder="우편번호"
            className="w-32 rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
          />
          <button
            type="button"
            className="rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-600 transition-colors hover:bg-stone-50"
          >
            {/* TODO: Integrate address search API */}
            주소 검색
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700">주소</label>
        <input
          type="text"
          value={form.addressLine1}
          onChange={(e) => handleChange("addressLine1", e.target.value)}
          placeholder="기본 주소"
          className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
        />
        <input
          type="text"
          value={form.addressLine2}
          onChange={(e) => handleChange("addressLine2", e.target.value)}
          placeholder="상세 주소"
          className="mt-2 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isDefault"
          checked={form.isDefault}
          onChange={(e) => handleChange("isDefault", e.target.checked)}
          className="h-4 w-4 rounded border-stone-300 text-brand-navy focus:ring-brand-navy"
        />
        <label htmlFor="isDefault" className="text-sm text-stone-600">
          기본 배송지로 설정
        </label>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-stone-300 px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-50"
          >
            취소
          </button>
        )}
        <button
          type="submit"
          className="rounded-md bg-brand-navy px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-navy-light"
        >
          저장
        </button>
      </div>
    </form>
  );
}
