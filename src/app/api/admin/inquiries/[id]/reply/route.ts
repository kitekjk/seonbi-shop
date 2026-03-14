import { createClient } from "@/lib/supabase/server";
import { requireAdmin, errorResponse, successResponse } from "@/lib/api/helpers";
import { isSupabaseConfigured } from "@/lib/mock-data";
import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error: authError } = await requireAdmin();
  if (authError) return authError;

  if (!isSupabaseConfigured()) {
    const { id: inquiryId } = await params;
    const body = await request.json();
    const { content } = body;
    return successResponse({
      data: {
        id: `reply-mock-${Date.now()}`,
        inquiry_id: inquiryId,
        user_id: user!.id,
        content: content?.trim() ?? "",
        created_at: new Date().toISOString(),
        users: { name: "관리자" },
      },
    }, 201);
  }

  const { id: inquiryId } = await params;
  const body = await request.json();
  const { content } = body;

  if (!content || content.trim().length === 0) {
    return errorResponse("답변 내용을 입력해주세요.");
  }

  const supabase = await createClient();

  // Check inquiry exists
  const { data: inquiry } = await supabase
    .from("inquiries")
    .select("id")
    .eq("id", inquiryId)
    .single();

  if (!inquiry) return errorResponse("문의를 찾을 수 없습니다.", 404);

  // Create reply
  const { data: reply, error: replyError } = await supabase
    .from("inquiry_replies")
    .insert({
      inquiry_id: inquiryId,
      user_id: user!.id,
      content: content.trim(),
    })
    .select("*, users(name)")
    .single();

  if (replyError) return errorResponse(replyError.message, 500);

  // Update inquiry status
  await supabase
    .from("inquiries")
    .update({ status: "answered" })
    .eq("id", inquiryId);

  return successResponse({ data: reply }, 201);
}
