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
    .from("products")
    .select(
      `*, product_options(id, name, additional_price, stock, is_active), product_images(id, url, alt_text, sort_order), product_tags(id, tag)`,
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
  const { name, slug, description, detail_html, base_price, category, options, images, tags } = body;

  if (!name || !slug || base_price === undefined) {
    return errorResponse("상품명, 슬러그, 기본가격은 필수입니다.");
  }

  const supabase = await createClient();

  // Create product
  const { data: product, error: productError } = await supabase
    .from("products")
    .insert({
      name,
      slug,
      description: description ?? "",
      detail_html: detail_html ?? "",
      base_price,
      category: category ?? "general",
    })
    .select()
    .single();

  if (productError) return errorResponse(productError.message, 500);

  // Add options
  if (options && Array.isArray(options) && options.length > 0) {
    await supabase.from("product_options").insert(
      options.map((opt: { name: string; additional_price?: number; stock?: number }) => ({
        product_id: product.id,
        name: opt.name,
        additional_price: opt.additional_price ?? 0,
        stock: opt.stock ?? 0,
      }))
    );
  }

  // Add images
  if (images && Array.isArray(images) && images.length > 0) {
    await supabase.from("product_images").insert(
      images.map((img: { url: string; alt_text?: string }, i: number) => ({
        product_id: product.id,
        url: img.url,
        alt_text: img.alt_text ?? "",
        sort_order: i,
      }))
    );
  }

  // Add tags
  if (tags && Array.isArray(tags) && tags.length > 0) {
    await supabase.from("product_tags").insert(
      tags.map((tag: string) => ({
        product_id: product.id,
        tag,
      }))
    );
  }

  // Fetch complete product
  const { data: fullProduct } = await supabase
    .from("products")
    .select(
      `*, product_options(id, name, additional_price, stock), product_images(id, url, alt_text, sort_order), product_tags(id, tag)`
    )
    .eq("id", product.id)
    .single();

  return successResponse({ data: fullProduct }, 201);
}
