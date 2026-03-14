import { createClient } from "@/lib/supabase/server";
import { requireAuth, errorResponse, successResponse } from "@/lib/api/helpers";
import { NextRequest } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error: authError } = await requireAuth();
  if (authError) return authError;

  const { id } = await params;
  const body = await request.json();
  const { rating, content } = body;

  const supabase = await createClient();

  // Verify ownership
  const { data: review } = await supabase
    .from("reviews")
    .select("id, user_id")
    .eq("id", id)
    .single();

  if (!review) return errorResponse("리뷰를 찾을 수 없습니다.", 404);
  if (review.user_id !== user!.id) return errorResponse("본인의 리뷰만 수정할 수 있습니다.", 403);

  const updateData: Record<string, unknown> = {};
  if (rating !== undefined) {
    if (rating < 1 || rating > 5) return errorResponse("별점은 1~5점 사이여야 합니다.");
    updateData.rating = rating;
  }
  if (content !== undefined) updateData.content = content;

  const { data: updated, error } = await supabase
    .from("reviews")
    .update(updateData)
    .eq("id", id)
    .select("*, review_images(id, url, sort_order), users(name)")
    .single();

  if (error) return errorResponse(error.message, 500);

  return successResponse({ data: updated });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error: authError } = await requireAuth();
  if (authError) return authError;

  const { id } = await params;
  const supabase = await createClient();

  const { data: review } = await supabase
    .from("reviews")
    .select("id, user_id")
    .eq("id", id)
    .single();

  if (!review) return errorResponse("리뷰를 찾을 수 없습니다.", 404);
  if (review.user_id !== user!.id) return errorResponse("본인의 리뷰만 삭제할 수 있습니다.", 403);

  // Delete review images from storage
  const { data: images } = await supabase
    .from("review_images")
    .select("url")
    .eq("review_id", id);

  if (images && images.length > 0) {
    const paths = images
      .map((img) => {
        const match = img.url.match(/review-images\/(.+)$/);
        return match ? match[1] : null;
      })
      .filter(Boolean) as string[];

    if (paths.length > 0) {
      await supabase.storage.from("review-images").remove(paths);
    }
  }

  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) return errorResponse(error.message, 500);

  return successResponse({ message: "리뷰가 삭제되었습니다." });
}
