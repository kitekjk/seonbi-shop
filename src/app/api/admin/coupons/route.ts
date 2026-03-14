import { createClient } from "@/lib/supabase/server";
import { requireAdmin, errorResponse, successResponse } from "@/lib/api/helpers";
import { isSupabaseConfigured, MOCK_COUPONS } from "@/lib/mock-data";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  if (!isSupabaseConfigured()) {
    return successResponse({
      data: MOCK_COUPONS,
      pagination: { page: 1, limit: 20, total: MOCK_COUPONS.length, totalPages: 1 },
    });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "20", 10);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const supabase = await createClient();

  const { data, error, count } = await supabase
    .from("coupons")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) return errorResponse(error.message, 500);

  return successResponse({
    data,
    pagination: { page, limit, total: count ?? 0, totalPages: Math.ceil((count ?? 0) / limit) },
  });
}

export async function POST(request: NextRequest) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  if (!isSupabaseConfigured()) {
    const body = await request.json();
    return successResponse({
      data: {
        id: `coupon-mock-${Date.now()}`,
        ...body,
        used_count: 0,
        is_active: true,
        created_at: new Date().toISOString(),
      },
    }, 201);
  }

  const body = await request.json();
  const {
    code,
    name,
    type,
    discount_value,
    min_order_amount,
    max_discount_amount,
    product_id,
    starts_at,
    expires_at,
    max_uses,
  } = body;

  if (!code || !name || !type || !discount_value || !starts_at || !expires_at) {
    return errorResponse("코드, 이름, 유형, 할인값, 시작일, 종료일은 필수입니다.");
  }

  if (!["fixed", "percent"].includes(type)) {
    return errorResponse("유효하지 않은 쿠폰 유형입니다.");
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("coupons")
    .insert({
      code,
      name,
      type,
      discount_value,
      min_order_amount: min_order_amount ?? 0,
      max_discount_amount: max_discount_amount ?? null,
      product_id: product_id ?? null,
      starts_at,
      expires_at,
      max_uses: max_uses ?? null,
    })
    .select()
    .single();

  if (error) return errorResponse(error.message, 500);

  return successResponse({ data }, 201);
}
