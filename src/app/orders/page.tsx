import Link from "next/link";
import { redirect } from "next/navigation";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { getAuthUser } from "@/lib/api/helpers";
import { getUserOrders } from "@/lib/api/orders";

type OrderStatus = "payment_completed" | "preparing" | "shipping" | "delivered" | "cancelled";

interface OrderRow {
  id: string;
  order_number: string;
  status: OrderStatus;
  created_at: string;
  final_amount: number;
  order_items: Array<{
    id: string;
    product_name: string;
    option_name: string | null;
    quantity: number;
    total_price: number;
  }>;
}

export default async function OrdersPage() {
  let orders: OrderRow[] = [];

  try {
    const user = await getAuthUser();
    if (!user) redirect("/login");
    const { data } = await getUserOrders(user.id);
    orders = (data ?? []) as unknown as OrderRow[];
  } catch {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-bold text-stone-900">주문 내역</h1>
      <p className="mt-2 text-sm text-stone-500">
        총 {orders.length}건의 주문이 있습니다
      </p>

      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="block rounded-xl border border-stone-200 p-6 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <OrderStatusBadge status={order.status} />
                <span className="text-sm font-medium text-stone-500">
                  {order.order_number}
                </span>
              </div>
              <span className="text-xs text-stone-400">
                {new Date(order.created_at).toLocaleDateString("ko-KR")}
              </span>
            </div>

            <div className="mt-4 space-y-2">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-brand-cream text-xl">
                    🏺
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-stone-900">{item.product_name}</p>
                    <p className="text-xs text-stone-400">
                      {item.option_name ?? "기본"} · {item.quantity}개
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-stone-700">
                    {item.total_price.toLocaleString("ko-KR")}원
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-4">
              <span className="text-sm text-stone-500">총 결제금액</span>
              <span className="text-lg font-bold text-brand-navy">
                {order.final_amount.toLocaleString("ko-KR")}원
              </span>
            </div>
          </Link>
        ))}

        {orders.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-5xl">📦</p>
            <p className="mt-4 text-lg font-medium text-stone-500">주문 내역이 없습니다</p>
            <Link
              href="/products"
              className="mt-6 inline-block rounded-lg bg-brand-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-light"
            >
              상품 둘러보기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
