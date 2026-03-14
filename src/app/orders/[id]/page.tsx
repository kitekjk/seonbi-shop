import Link from "next/link";
import { redirect } from "next/navigation";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { getAuthUser } from "@/lib/api/helpers";
import { getOrderById } from "@/lib/api/orders";

type OrderStatus = "payment_completed" | "preparing" | "shipping" | "delivered" | "cancelled";

interface OrderDetail {
  id: string;
  order_number: string;
  status: OrderStatus;
  created_at: string;
  recipient_name: string;
  phone: string;
  postal_code: string;
  address_line1: string;
  address_line2: string | null;
  total_amount: number;
  discount_amount: number;
  shipping_fee: number;
  final_amount: number;
  note: string | null;
  order_items: Array<{
    id: string;
    product_name: string;
    option_name: string | null;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>;
  payments: Array<{
    method: string;
    status: string;
    amount: number;
    paid_at: string | null;
  }>;
  shipments: Array<{
    carrier: string;
    tracking_number: string | null;
    status: string;
  }>;
}

const TRACKING_STEPS = [
  { key: "preparing", label: "배송준비" },
  { key: "picked_up", label: "집하완료" },
  { key: "in_transit", label: "배송중" },
  { key: "out_for_delivery", label: "배송출발" },
  { key: "delivered", label: "배송완료" },
];

function getStepIndex(status: string) {
  return TRACKING_STEPS.findIndex((s) => s.key === status);
}

const METHOD_LABELS: Record<string, string> = {
  mock_card: "신용카드",
  mock_bank_transfer: "계좌이체",
  mock_virtual_account: "가상계좌",
};

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  let order: OrderDetail | null = null;

  try {
    const user = await getAuthUser();
    if (!user) redirect("/login");
    const { data } = await getOrderById(id, user.id);
    order = data as unknown as OrderDetail;
  } catch {
    redirect("/login");
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <p className="text-lg text-stone-500">주문을 찾을 수 없습니다.</p>
        <Link href="/orders" className="mt-4 inline-block text-sm text-brand-navy hover:underline">
          ← 주문 내역으로
        </Link>
      </div>
    );
  }

  const shipment = order.shipments?.[0];
  const payment = order.payments?.[0];
  const currentStep = shipment ? getStepIndex(shipment.status) : 0;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/orders" className="text-sm text-stone-400 hover:text-brand-navy">
            ← 주문 내역으로
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-stone-900">주문 상세</h1>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <p className="mt-2 text-sm text-stone-500">
        주문번호: {order.order_number} ·{" "}
        {new Date(order.created_at).toLocaleDateString("ko-KR")}{" "}
        {new Date(order.created_at).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
      </p>

      {shipment && (
        <section className="mt-8 rounded-xl border border-stone-200 p-6">
          <h2 className="text-lg font-bold text-stone-900">배송 추적</h2>
          <p className="mt-1 text-sm text-stone-500">
            {shipment.carrier}
            {shipment.tracking_number ? ` · 운송장번호: ${shipment.tracking_number}` : ""}
          </p>
          <div className="mt-6 flex items-center justify-between">
            {TRACKING_STEPS.map((step, idx) => (
              <div key={step.key} className="flex flex-1 flex-col items-center">
                <div className="flex w-full items-center">
                  {idx > 0 && (
                    <div className={`h-0.5 flex-1 ${idx <= currentStep ? "bg-brand-navy" : "bg-stone-200"}`} />
                  )}
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                      idx <= currentStep ? "bg-brand-navy text-white" : "bg-stone-200 text-stone-400"
                    }`}
                  >
                    {idx < currentStep ? "✓" : idx + 1}
                  </div>
                  {idx < TRACKING_STEPS.length - 1 && (
                    <div className={`h-0.5 flex-1 ${idx < currentStep ? "bg-brand-navy" : "bg-stone-200"}`} />
                  )}
                </div>
                <p className={`mt-2 text-xs font-medium ${idx <= currentStep ? "text-brand-navy" : "text-stone-400"}`}>
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-6 rounded-xl border border-stone-200 p-6">
        <h2 className="text-lg font-bold text-stone-900">주문 상품</h2>
        <div className="mt-4 divide-y divide-stone-100">
          {order.order_items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 py-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-brand-cream text-2xl">🏺</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-stone-900">{item.product_name}</p>
                <p className="text-xs text-stone-400">
                  {item.option_name ?? "기본"} · {item.quantity}개 · 개당{" "}
                  {item.unit_price.toLocaleString("ko-KR")}원
                </p>
              </div>
              <p className="text-sm font-bold text-stone-900">{item.total_price.toLocaleString("ko-KR")}원</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-6 grid grid-cols-2 gap-6">
        <section className="rounded-xl border border-stone-200 p-6">
          <h2 className="text-lg font-bold text-stone-900">배송지 정보</h2>
          <div className="mt-4 space-y-2 text-sm">
            <p className="font-medium text-stone-900">{order.recipient_name}</p>
            <p className="text-stone-500">{order.phone}</p>
            <p className="text-stone-500">
              [{order.postal_code}] {order.address_line1} {order.address_line2 ?? ""}
            </p>
            {order.note && <p className="text-stone-400">배송메모: {order.note}</p>}
          </div>
        </section>

        <section className="rounded-xl border border-stone-200 p-6">
          <h2 className="text-lg font-bold text-stone-900">결제 정보</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-500">결제수단</span>
              <span>{payment ? (METHOD_LABELS[payment.method] ?? payment.method) : "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">상품금액</span>
              <span>{order.total_amount.toLocaleString("ko-KR")}원</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-brand-red">
                <span>할인</span>
                <span>-{order.discount_amount.toLocaleString("ko-KR")}원</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-stone-500">배송비</span>
              <span>{order.shipping_fee === 0 ? "무료" : `${order.shipping_fee.toLocaleString("ko-KR")}원`}</span>
            </div>
            <div className="flex justify-between border-t border-stone-200 pt-3">
              <span className="font-semibold text-stone-900">총 결제금액</span>
              <span className="text-lg font-bold text-brand-red">
                {order.final_amount.toLocaleString("ko-KR")}원
              </span>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-8 flex justify-center gap-3">
        {(order.status === "payment_completed" || order.status === "preparing") && (
          <button className="rounded-lg border border-stone-300 px-6 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-50">
            주문 취소
          </button>
        )}
        <Link
          href="/mypage"
          className="rounded-lg border border-stone-300 px-6 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-50"
        >
          배송 문의
        </Link>
      </div>
    </div>
  );
}
