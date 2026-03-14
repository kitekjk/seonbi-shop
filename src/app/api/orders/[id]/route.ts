import { requireAuth, errorResponse, successResponse } from "@/lib/api/helpers";
import { getOrderById } from "@/lib/api/orders";
import { isSupabaseConfigured, MOCK_ORDERS } from "@/lib/mock-data";
import { NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error: authError } = await requireAuth();
  if (authError) return authError;

  const { id } = await params;
  const { data, error } = await getOrderById(id, user!.id);

  if (error || !data) return errorResponse("주문을 찾을 수 없습니다.", 404);

  return successResponse({ data });
}

// Cancel order (only before shipping)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error: authError } = await requireAuth();
  if (authError) return authError;

  const { id } = await params;
  const body = await request.json();
  const { action } = body;

  if (action !== "cancel") return errorResponse("지원하지 않는 액션입니다.");

  // Mock mode: simulate order cancellation
  if (!isSupabaseConfigured()) {
    const order = MOCK_ORDERS.find((o) => o.id === id && o.user_id === user!.id);
    if (!order) return errorResponse("주문을 찾을 수 없습니다.", 404);

    const status = order.status as string;
    if (status !== "payment_completed" && status !== "preparing") {
      return errorResponse("배송 시작 후에는 취소할 수 없습니다.");
    }

    return successResponse({ message: "주문이 취소되었습니다." });
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("id, status")
    .eq("id", id)
    .eq("user_id", user!.id)
    .single();

  if (!order) return errorResponse("주문을 찾을 수 없습니다.", 404);

  if (order.status !== "payment_completed" && order.status !== "preparing") {
    return errorResponse("배송 시작 후에는 취소할 수 없습니다.");
  }

  const { error } = await supabase
    .from("orders")
    .update({ status: "cancelled" })
    .eq("id", id);

  if (error) return errorResponse(error.message, 500);

  // Refund payment
  await supabase
    .from("payments")
    .update({ status: "refunded" })
    .eq("order_id", id);

  return successResponse({ message: "주문이 취소되었습니다." });
}
