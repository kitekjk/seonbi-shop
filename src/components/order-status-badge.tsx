type OrderStatus =
  | "payment_completed"
  | "preparing"
  | "shipping"
  | "delivered"
  | "cancelled";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  payment_completed: {
    label: "결제완료",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  preparing: {
    label: "배송준비중",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  shipping: {
    label: "배송중",
    className: "bg-brand-cream text-brand-gold-dark border-brand-gold",
  },
  delivered: {
    label: "배송완료",
    className: "bg-green-50 text-green-700 border-green-200",
  },
  cancelled: {
    label: "주문취소",
    className: "bg-stone-100 text-stone-500 border-stone-300",
  },
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}
