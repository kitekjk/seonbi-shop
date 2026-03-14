import { requireAuth, errorResponse, successResponse } from "@/lib/api/helpers";
import { isSupabaseConfigured, MOCK_INQUIRIES } from "@/lib/mock-data";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { user, error: authError } = await requireAuth();
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "20", 10);

  // Mock mode: return mock inquiries
  if (!isSupabaseConfigured()) {
    const userInquiries = MOCK_INQUIRIES.filter((inq) => inq.user_id === user!.id);
    const from = (page - 1) * limit;
    const sliced = userInquiries.slice(from, from + limit);

    return successResponse({
      data: sliced,
      pagination: {
        page,
        limit,
        total: userInquiries.length,
        totalPages: Math.ceil(userInquiries.length / limit),
      },
    });
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from("inquiries")
    .select(
      `*, inquiry_replies(id, content, created_at, users(name))`,
      { count: "exact" }
    )
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) return errorResponse(error.message, 500);

  return successResponse({
    data,
    pagination: {
      page,
      limit,
      total: count ?? 0,
      totalPages: Math.ceil((count ?? 0) / limit),
    },
  });
}
