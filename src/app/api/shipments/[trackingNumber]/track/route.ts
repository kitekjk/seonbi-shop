import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Mock delivery tracking statuses with timestamps
function generateMockTracking(trackingNumber: string, createdAt: string) {
  const created = new Date(createdAt);
  const now = new Date();
  const hoursSinceCreated = (now.getTime() - created.getTime()) / (1000 * 60 * 60);

  const steps: {
    status: string;
    location: string;
    description: string;
    timestamp: string;
  }[] = [];

  // Step 1: Order received (always shown)
  steps.push({
    status: "preparing",
    location: "선비샵 물류센터",
    description: "상품이 접수되었습니다.",
    timestamp: created.toISOString(),
  });

  if (hoursSinceCreated >= 4) {
    const pickedUp = new Date(created.getTime() + 4 * 60 * 60 * 1000);
    steps.push({
      status: "picked_up",
      location: "서울 강남 집하장",
      description: "택배사에서 상품을 수거했습니다.",
      timestamp: pickedUp.toISOString(),
    });
  }

  if (hoursSinceCreated >= 12) {
    const inTransit = new Date(created.getTime() + 12 * 60 * 60 * 1000);
    steps.push({
      status: "in_transit",
      location: "대전 허브 터미널",
      description: "배송 중입니다.",
      timestamp: inTransit.toISOString(),
    });
  }

  if (hoursSinceCreated >= 24) {
    const outForDelivery = new Date(created.getTime() + 24 * 60 * 60 * 1000);
    steps.push({
      status: "out_for_delivery",
      location: "배송지 인근 터미널",
      description: "배송 출발했습니다.",
      timestamp: outForDelivery.toISOString(),
    });
  }

  if (hoursSinceCreated >= 36) {
    const delivered = new Date(created.getTime() + 36 * 60 * 60 * 1000);
    steps.push({
      status: "delivered",
      location: "배송 완료",
      description: "배송이 완료되었습니다.",
      timestamp: delivered.toISOString(),
    });
  }

  const currentStatus = steps[steps.length - 1].status;

  return {
    tracking_number: trackingNumber,
    carrier: "한진택배",
    current_status: currentStatus,
    steps,
  };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ trackingNumber: string }> }
) {
  const { trackingNumber } = await params;

  const supabase = await createClient();

  const { data: shipment } = await supabase
    .from("shipments")
    .select("*, orders(created_at)")
    .eq("tracking_number", trackingNumber)
    .single();

  if (!shipment) {
    return NextResponse.json(
      { error: "운송장 번호를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  const createdAt =
    (shipment.orders as { created_at: string } | null)?.created_at ??
    shipment.created_at;

  const tracking = generateMockTracking(trackingNumber, createdAt);

  // Update shipment status if changed
  if (tracking.current_status !== shipment.status) {
    const updateData: Record<string, string> = {
      status: tracking.current_status,
    };
    if (tracking.current_status === "delivered") {
      updateData.delivered_at = new Date().toISOString();
    }
    await supabase.from("shipments").update(updateData).eq("id", shipment.id);

    // Also update order status
    if (tracking.current_status === "delivered") {
      await supabase
        .from("orders")
        .update({ status: "delivered" })
        .eq("id", shipment.order_id);
    } else if (
      tracking.current_status === "picked_up" ||
      tracking.current_status === "in_transit" ||
      tracking.current_status === "out_for_delivery"
    ) {
      await supabase
        .from("orders")
        .update({ status: "shipping" })
        .eq("id", shipment.order_id);
    }
  }

  return NextResponse.json({ data: tracking });
}
