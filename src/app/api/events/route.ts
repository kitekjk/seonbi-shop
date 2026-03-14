import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured, MOCK_EVENTS } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status"); // "active" | "ended" | null
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "20", 10);

  // Mock mode: return mock events
  if (!isSupabaseConfigured()) {
    const now = new Date().toISOString();
    let events = MOCK_EVENTS.filter((e) => e.is_active);

    if (status === "active") {
      events = events.filter((e) => e.starts_at <= now && e.ends_at >= now);
    } else if (status === "ended") {
      events = events.filter((e) => e.ends_at < now);
    }

    // Sort by starts_at descending
    events.sort((a, b) => b.starts_at.localeCompare(a.starts_at));

    const from = (page - 1) * limit;
    const sliced = events.slice(from, from + limit);

    // Strip nested fields for list view (match Supabase "select *" behavior)
    const listData = sliced.map(({ event_comments: _c, event_coupons: _ec, ...rest }) => rest);

    return NextResponse.json({
      data: listData,
      pagination: {
        page,
        limit,
        total: events.length,
        totalPages: Math.ceil(events.length / limit),
      },
    });
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const now = new Date().toISOString();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("events")
    .select("*", { count: "exact" })
    .eq("is_active", true)
    .order("starts_at", { ascending: false })
    .range(from, to);

  if (status === "active") {
    query = query.lte("starts_at", now).gte("ends_at", now);
  } else if (status === "ended") {
    query = query.lt("ends_at", now);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total: count ?? 0,
      totalPages: Math.ceil((count ?? 0) / limit),
    },
  });
}
