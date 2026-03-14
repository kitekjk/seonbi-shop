import { requireAuth, errorResponse, successResponse } from "@/lib/api/helpers";
import { isSupabaseConfigured } from "@/lib/mock-data";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { user, error: authError } = await requireAuth();
  if (authError) return authError;

  const body = await request.json();
  const { type, title, content, product_id, order_id } = body;

  if (!type || !title || !content) {
    return errorResponse("문의 유형, 제목, 내용은 필수입니다.");
  }

  if (!["product", "shipping", "general"].includes(type)) {
    return errorResponse("유효하지 않은 문의 유형입니다.");
  }

  // Mock mode: return mock inquiry
  if (!isSupabaseConfigured()) {
    const mockInquiry = {
      id: `inq-mock-${Date.now()}`,
      user_id: user!.id,
      type,
      title,
      content,
      product_id: product_id ?? null,
      order_id: order_id ?? null,
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return successResponse({ data: mockInquiry }, 201);
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("inquiries")
    .insert({
      user_id: user!.id,
      type,
      title,
      content,
      product_id: product_id ?? null,
      order_id: order_id ?? null,
    })
    .select()
    .single();

  if (error) return errorResponse(error.message, 500);

  return successResponse({ data }, 201);
}
