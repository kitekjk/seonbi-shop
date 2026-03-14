interface CouponBadgeProps {
  name: string;
  type: "fixed" | "percent";
  discountValue: number;
  expiresAt: string;
  isUsed?: boolean;
}

export function CouponBadge({
  name,
  type,
  discountValue,
  expiresAt,
  isUsed = false,
}: CouponBadgeProps) {
  const discountText =
    type === "fixed"
      ? `${discountValue.toLocaleString("ko-KR")}원`
      : `${discountValue}%`;

  return (
    <div
      className={`relative overflow-hidden rounded-lg border-2 border-dashed p-4 ${
        isUsed
          ? "border-stone-300 bg-stone-50 opacity-60"
          : "border-brand-gold bg-brand-cream"
      }`}
    >
      {isUsed && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="rotate-[-15deg] rounded-md border-2 border-stone-400 px-3 py-1 text-sm font-bold text-stone-400">
            사용완료
          </span>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-bold text-brand-red">{discountText} 할인</p>
          <p className="mt-0.5 text-sm font-medium text-stone-700">{name}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-stone-400">
            {new Date(expiresAt).toLocaleDateString("ko-KR")} 까지
          </p>
        </div>
      </div>
    </div>
  );
}
