import { createClient } from "@/lib/supabase/server";

export function generateOrderNumber(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ORD-${date}-${rand}`;
}

export function generateTransactionId(): string {
  return `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

export async function getUserOrders(userId: string, page = 1, limit = 20) {
  const supabase = await createClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from("orders")
    .select(
      `*, order_items(id, product_name, option_name, quantity, unit_price, total_price), payments(id, method, status, amount), shipments(id, carrier, tracking_number, status)`,
      { count: "exact" }
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(from, to);

  return { data, error, count, page, limit };
}

export async function getOrderById(orderId: string, userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select(
      `*, order_items(id, product_id, option_id, product_name, option_name, quantity, unit_price, total_price), payments(id, method, status, amount, transaction_id, paid_at), shipments(id, carrier, tracking_number, status, shipped_at, delivered_at)`
    )
    .eq("id", orderId)
    .eq("user_id", userId)
    .single();

  return { data, error };
}

export function calculateDiscount(
  coupon: {
    type: "fixed" | "percent";
    discount_value: number;
    max_discount_amount: number | null;
    min_order_amount: number;
  },
  totalAmount: number
): number {
  if (totalAmount < coupon.min_order_amount) return 0;

  if (coupon.type === "fixed") {
    return coupon.discount_value;
  }

  // percent
  let discount = Math.floor((totalAmount * coupon.discount_value) / 100);
  if (coupon.max_discount_amount && discount > coupon.max_discount_amount) {
    discount = coupon.max_discount_amount;
  }
  return discount;
}
