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
    return successResponse({ data: { id, ...body } });
  }

  const { id } = await params;
  const body = await request.json();

  const supabase = await createClient();

  const updateData: Record<string, unknown> = {};
  const allowedFields = [
    "code", "name", "type", "discount_value", "min_order_amount",
    "max_discount_amount", "product_id", "starts_at", "expires_at",
    "max_uses", "is_active",
  ];

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updateData[field] = body[field];
    }
  }

  const { data, error } = await supabase
    .from("coupons")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) return errorResponse(error.message, 500);

  return successResponse({ data });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  if (!isSupabaseConfigured()) {
    return successResponse({ message: "쿠폰이 삭제되었습니다." });
  }

  const { id } = await params;
  const supabase = await createClient();

  const { error } = await supabase.from("coupons").delete().eq("id", id);
  if (error) return errorResponse(error.message, 500);

  return successResponse({ message: "쿠폰이 삭제되었습니다." });
}
