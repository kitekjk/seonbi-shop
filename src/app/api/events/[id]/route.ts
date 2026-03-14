import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured, MOCK_EVENTS } from "@/lib/mock-data";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Mock mode: return mock event
  if (!isSupabaseConfigured()) {
    const event = MOCK_EVENTS.find((e) => e.id === id && e.is_active);
    if (!event) {
      return NextResponse.json({ error: "이벤트를 찾을 수 없습니다." }, { status: 404 });
    }
    return NextResponse.json({ data: event });
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select(
      `*,
      event_comments(id, content, created_at, users(id, name)),
      event_coupons(id, coupons(id, code, name, type, discount_value))`
    )
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "이벤트를 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json({ data });
}
