import { createClient } from "@/lib/supabase/server";
import { requireAdmin, errorResponse, successResponse } from "@/lib/api/helpers";
import { isSupabaseConfigured } from "@/lib/mock-data";
import { NextRequest } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  if (!isSupabaseConfigured()) {
    const { id } = await params;
    const body = await request.json();
    return successResponse({
      data: { id, ...body, updated_at: new Date().toISOString() },
    });
  }

  const { id } = await params;
  const body = await request.json();
  const { status, tracking_number, carrier } = body;

  const supabase = await createClient();

  // Update order status
  if (status) {
    const validStatuses = [
      "payment_completed",
      "preparing",
      "shipping",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return errorResponse("유효하지 않은 주문 상태입니다.");
    }

    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);
    if (error) return errorResponse(error.message, 500);

    // If cancelled, refund payment
    if (status === "cancelled") {
      await supabase
        .from("payments")
        .update({ status: "refunded" })
        .eq("order_id", id);
    }
  }

  // Update tracking number
  if (tracking_number) {
    const updateData: Record<string, string> = {
      tracking_number,
    };
    if (carrier) updateData.carrier = carrier;
    updateData.status = "picked_up";
    updateData.shipped_at = new Date().toISOString();

    await supabase.from("shipments").update(updateData).eq("order_id", id);

    // Update order status to shipping if not already
    await supabase
      .from("orders")
      .update({ status: "shipping" })
      .eq("id", id)
      .in("status", ["payment_completed", "preparing"]);
  }

  // Fetch updated order
  const { data: order } = await supabase
    .from("orders")
    .select(
      `*, order_items(id, product_name, option_name, quantity, unit_price, total_price), payments(id, method, status, amount), shipments(id, carrier, tracking_number, status, shipped_at), users(id, name, email)`
    )
    .eq("id", id)
    .single();

  return successResponse({ data: order });
}
