import { createClient } from "@/lib/supabase/server";
import { requireAuth, errorResponse, successResponse } from "@/lib/api/helpers";
import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error: authError } = await requireAuth();
  if (authError) return authError;

  const { id: eventId } = await params;
  const body = await request.json();
  const { content } = body;

  if (!content || content.trim().length === 0) {
    return errorResponse("댓글 내용을 입력해주세요.");
  }

  const supabase = await createClient();

  // Check event exists and is active
  const { data: event } = await supabase
    .from("events")
    .select("id, ends_at")
    .eq("id", eventId)
    .eq("is_active", true)
    .single();

  if (!event) return errorResponse("이벤트를 찾을 수 없습니다.", 404);

  const now = new Date().toISOString();
  if (event.ends_at < now) {
    return errorResponse("종료된 이벤트에는 댓글을 작성할 수 없습니다.");
  }

  const { data, error } = await supabase
    .from("event_comments")
    .insert({
      event_id: eventId,
      user_id: user!.id,
      content: content.trim(),
    })
    .select("*, users(id, name)")
    .single();

  if (error) return errorResponse(error.message, 500);

  return successResponse({ data }, 201);
}
