import { createClient } from "@/lib/supabase/server";
import { requireAdmin, errorResponse, successResponse } from "@/lib/api/helpers";

export async function GET() {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  const supabase = await createClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();

  // Today's orders
  const { count: todayOrders } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .gte("created_at", todayISO)
    .neq("status", "cancelled");

  // Today's revenue
  const { data: todayPayments } = await supabase
    .from("payments")
    .select("amount")
    .eq("status", "completed")
    .gte("created_at", todayISO);

  const todayRevenue =
    todayPayments?.reduce((sum, p) => sum + p.amount, 0) ?? 0;

  // Pending inquiries
  const { count: pendingInquiries } = await supabase
    .from("inquiries")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  // Orders by status
  const { data: ordersByStatus } = await supabase
    .from("orders")
    .select("status")
    .neq("status", "cancelled");

  const statusCounts: Record<string, number> = {};
  ordersByStatus?.forEach((o) => {
    statusCounts[o.status] = (statusCounts[o.status] ?? 0) + 1;
  });

  // Recent orders
  const { data: recentOrders } = await supabase
    .from("orders")
    .select("id, order_number, status, final_amount, created_at, users(name)")
    .order("created_at", { ascending: false })
    .limit(10);

  return successResponse({
    today_orders: todayOrders ?? 0,
    today_revenue: todayRevenue,
    pending_inquiries: pendingInquiries ?? 0,
    orders_by_status: statusCounts,
    recent_orders: recentOrders ?? [],
  });
}
