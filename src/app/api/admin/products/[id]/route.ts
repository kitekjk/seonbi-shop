import { createClient } from "@/lib/supabase/server";
import { requireAdmin, errorResponse, successResponse } from "@/lib/api/helpers";
import { NextRequest } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  const { id } = await params;
  const body = await request.json();
  const { name, slug, description, detail_html, base_price, category, is_active, options, images, tags } = body;

  const supabase = await createClient();

  // Update product fields
  const updateData: Record<string, unknown> = {};
  if (name !== undefined) updateData.name = name;
  if (slug !== undefined) updateData.slug = slug;
  if (description !== undefined) updateData.description = description;
  if (detail_html !== undefined) updateData.detail_html = detail_html;
  if (base_price !== undefined) updateData.base_price = base_price;
  if (category !== undefined) updateData.category = category;
  if (is_active !== undefined) updateData.is_active = is_active;

  if (Object.keys(updateData).length > 0) {
    const { error } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", id);
    if (error) return errorResponse(error.message, 500);
  }

  // Replace options if provided
  if (options !== undefined) {
    await supabase.from("product_options").delete().eq("product_id", id);
    if (Array.isArray(options) && options.length > 0) {
      await supabase.from("product_options").insert(
        options.map((opt: { name: string; additional_price?: number; stock?: number }) => ({
          product_id: id,
          name: opt.name,
          additional_price: opt.additional_price ?? 0,
          stock: opt.stock ?? 0,
        }))
      );
    }
  }

  // Replace images if provided
  if (images !== undefined) {
    await supabase.from("product_images").delete().eq("product_id", id);
    if (Array.isArray(images) && images.length > 0) {
      await supabase.from("product_images").insert(
        images.map((img: { url: string; alt_text?: string }, i: number) => ({
          product_id: id,
          url: img.url,
          alt_text: img.alt_text ?? "",
          sort_order: i,
        }))
      );
    }
  }

  // Replace tags if provided
  if (tags !== undefined) {
    await supabase.from("product_tags").delete().eq("product_id", id);
    if (Array.isArray(tags) && tags.length > 0) {
      await supabase.from("product_tags").insert(
        tags.map((tag: string) => ({
          product_id: id,
          tag,
        }))
      );
    }
  }

  const { data: updated } = await supabase
    .from("products")
    .select(
      `*, product_options(id, name, additional_price, stock, is_active), product_images(id, url, alt_text, sort_order), product_tags(id, tag)`
    )
    .eq("id", id)
    .single();

  return successResponse({ data: updated });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  const { id } = await params;
  const supabase = await createClient();

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return errorResponse(error.message, 500);

  return successResponse({ message: "상품이 삭제되었습니다." });
}
