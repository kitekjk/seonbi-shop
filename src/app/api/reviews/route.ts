import { createClient } from "@/lib/supabase/server";
import { requireAuth, errorResponse, successResponse } from "@/lib/api/helpers";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { user, error: authError } = await requireAuth();
  if (authError) return authError;

  const formData = await request.formData();
  const productId = formData.get("product_id") as string;
  const orderItemId = (formData.get("order_item_id") as string) || null;
  const rating = parseInt(formData.get("rating") as string, 10);
  const content = formData.get("content") as string;
  const images = formData.getAll("images") as File[];

  if (!productId || !rating || !content) {
    return errorResponse("상품ID, 별점, 내용은 필수입니다.");
  }
  if (rating < 1 || rating > 5) {
    return errorResponse("별점은 1~5점 사이여야 합니다.");
  }

  const supabase = await createClient();

  // Check product exists
  const { data: product } = await supabase
    .from("products")
    .select("id")
    .eq("id", productId)
    .single();
  if (!product) return errorResponse("상품을 찾을 수 없습니다.");

  // Create review
  const { data: review, error: reviewError } = await supabase
    .from("reviews")
    .insert({
      user_id: user!.id,
      product_id: productId,
      order_item_id: orderItemId,
      rating,
      content,
    })
    .select()
    .single();

  if (reviewError) return errorResponse(reviewError.message, 500);

  // Upload images to Supabase Storage
  if (images.length > 0) {
    const imageRecords: { review_id: string; url: string; sort_order: number }[] = [];

    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      if (!file.size) continue;

      const ext = file.name.split(".").pop();
      const path = `reviews/${review.id}/${i}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("review-images")
        .upload(path, file);

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from("review-images")
          .getPublicUrl(path);

        imageRecords.push({
          review_id: review.id,
          url: urlData.publicUrl,
          sort_order: i,
        });
      }
    }

    if (imageRecords.length > 0) {
      await supabase.from("review_images").insert(imageRecords);
    }
  }

  // Fetch complete review with images
  const { data: fullReview } = await supabase
    .from("reviews")
    .select("*, review_images(id, url, sort_order), users(name)")
    .eq("id", review.id)
    .single();

  return successResponse({ data: fullReview }, 201);
}
