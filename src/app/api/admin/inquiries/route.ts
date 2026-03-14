import { createClient } from "@/lib/supabase/server";
import { requireAdmin, errorResponse, successResponse } from "@/lib/api/helpers";
import { isSupabaseConfigured, MOCK_INQUIRIES } from "@/lib/mock-data";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  if (!isSupabaseConfigured()) {
    return successResponse({
      data: MOCK_INQUIRIES,
      pagination: { page: 1, limit: 20, total: MOCK_INQUIRIES.length, totalPages: 1 },
    });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "20", 10);
  const status = searchParams.get("status");
  const type = searchParams.get("type");
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const supabase = await createClient();

  let query = supabase
    .from("inquiries")
    .select(
      `*, users(id, name, email), inquiry_replies(id, content, created_at, users(name))`,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (status) query = query.eq("status", status as "pending" | "answered" | "closed");
  if (type) query = query.eq("type", type as "product" | "shipping" | "general");

  const { data, error, count } = await query;

  if (error) return errorResponse(error.message, 500);

  return successResponse({
    data,
    pagination: { page, limit, total: count ?? 0, totalPages: Math.ceil((count ?? 0) / limit) },
  });
}
