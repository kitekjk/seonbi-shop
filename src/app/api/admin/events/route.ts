import { createClient } from "@/lib/supabase/server";
import { requireAdmin, errorResponse, successResponse } from "@/lib/api/helpers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "20", 10);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const supabase = await createClient();

  const { data, error, count } = await supabase
    .from("events")
    .select(
      `*, event_coupons(id, coupons(id, code, name))`,
      { count: "exact" }
    )
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

  const body = await request.json();
  const {
    title,
    slug,
    description,
    body_html,
    image_url,
    starts_at,
    ends_at,
    coupon_ids,
  } = body;

  if (!title || !slug || !starts_at || !ends_at) {
    return errorResponse("제목, 슬러그, 시작일, 종료일은 필수입니다.");
  }

  const supabase = await createClient();

  const { data: event, error: eventError } = await supabase
    .from("events")
    .insert({
      title,
      slug,
      description: description ?? "",
      body_html: body_html ?? "",
      image_url: image_url ?? null,
      starts_at,
      ends_at,
    })
    .select()
    .single();

  if (eventError) return errorResponse(eventError.message, 500);

  // Link coupons
  if (coupon_ids && Array.isArray(coupon_ids) && coupon_ids.length > 0) {
    await supabase.from("event_coupons").insert(
      coupon_ids.map((couponId: string) => ({
        event_id: event.id,
        coupon_id: couponId,
      }))
    );
  }

  const { data: fullEvent } = await supabase
    .from("events")
    .select(`*, event_coupons(id, coupons(id, code, name))`)
    .eq("id", event.id)
    .single();

  return successResponse({ data: fullEvent }, 201);
}
