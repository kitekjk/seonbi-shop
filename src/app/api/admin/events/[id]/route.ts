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
  const { coupon_ids, ...eventFields } = body;

  const supabase = await createClient();

  // Update event fields
  const updateData: Record<string, unknown> = {};
  const allowedFields = [
    "title", "slug", "description", "body_html",
    "image_url", "starts_at", "ends_at", "is_active",
  ];

  for (const field of allowedFields) {
    if (eventFields[field] !== undefined) {
      updateData[field] = eventFields[field];
    }
  }

  if (Object.keys(updateData).length > 0) {
    const { error } = await supabase
      .from("events")
      .update(updateData)
      .eq("id", id);
    if (error) return errorResponse(error.message, 500);
  }

  // Update coupon links if provided
  if (coupon_ids !== undefined) {
    await supabase.from("event_coupons").delete().eq("event_id", id);
    if (Array.isArray(coupon_ids) && coupon_ids.length > 0) {
      await supabase.from("event_coupons").insert(
        coupon_ids.map((couponId: string) => ({
          event_id: id,
          coupon_id: couponId,
        }))
      );
    }
  }

  const { data: updated } = await supabase
    .from("events")
    .select(`*, event_coupons(id, coupons(id, code, name))`)
    .eq("id", id)
    .single();

  return successResponse({ data: updated });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  if (!isSupabaseConfigured()) {
    return successResponse({ message: "이벤트가 삭제되었습니다." });
  }

  const { id } = await params;
  const supabase = await createClient();

  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) return errorResponse(error.message, 500);

  return successResponse({ message: "이벤트가 삭제되었습니다." });
}
