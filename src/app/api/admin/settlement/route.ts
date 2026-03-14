import { createClient } from "@/lib/supabase/server";
import { requireAdmin, errorResponse, successResponse } from "@/lib/api/helpers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("start_date");
  const endDate = searchParams.get("end_date");
  const userId = searchParams.get("user_id");

  const supabase = await createClient();

  // Sales report
  let ordersQuery = supabase
    .from("orders")
    .select(
      `id, order_number, status, total_amount, discount_amount, shipping_fee, final_amount, created_at, users(id, name, email), order_items(product_name, quantity, unit_price, total_price)`
    )
    .neq("status", "cancelled");

  if (startDate) ordersQuery = ordersQuery.gte("created_at", startDate);
  if (endDate) ordersQuery = ordersQuery.lte("created_at", endDate);
  if (userId) ordersQuery = ordersQuery.eq("user_id", userId);

  const { data: orders, error } = await ordersQuery.order("created_at", {
    ascending: false,
  });

  if (error) return errorResponse(error.message, 500);

  // Calculate summary
  const summary = {
    total_orders: orders?.length ?? 0,
    total_sales: 0,
    total_discounts: 0,
    total_shipping: 0,
    net_revenue: 0,
    commission_rate: 0.03, // 3% commission
    commission_amount: 0,
    settlement_amount: 0,
  };

  orders?.forEach((order) => {
    summary.total_sales += order.total_amount;
    summary.total_discounts += order.discount_amount;
    summary.total_shipping += order.shipping_fee;
    summary.net_revenue += order.final_amount;
  });

  summary.commission_amount = Math.floor(
    summary.net_revenue * summary.commission_rate
  );
  summary.settlement_amount = summary.net_revenue - summary.commission_amount;

  // Product sales breakdown
  const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {};
  orders?.forEach((order) => {
    const items = order.order_items as { product_name: string; quantity: number; total_price: number }[];
    items?.forEach((item) => {
      if (!productSales[item.product_name]) {
        productSales[item.product_name] = {
          name: item.product_name,
          quantity: 0,
          revenue: 0,
        };
      }
      productSales[item.product_name].quantity += item.quantity;
      productSales[item.product_name].revenue += item.total_price;
    });
  });

  return successResponse({
    summary,
    product_sales: Object.values(productSales).sort(
      (a, b) => b.revenue - a.revenue
    ),
    orders,
  });
}
