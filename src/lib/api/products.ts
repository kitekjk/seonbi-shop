import { isSupabaseConfigured, MOCK_PRODUCTS } from "@/lib/mock-data";

export async function getProducts({
  page = 1,
  limit = 20,
  category,
}: {
  page?: number;
  limit?: number;
  category?: string;
}) {
  if (!isSupabaseConfigured()) {
    let filtered = MOCK_PRODUCTS.filter((p) => p.is_active);
    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }
    const from = (page - 1) * limit;
    const sliced = filtered.slice(from, from + limit);
    return { data: sliced, error: null, count: filtered.length, page, limit };
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("products")
    .select(
      `*, product_images(id, url, alt_text, sort_order), product_tags(id, tag)`,
      { count: "exact" }
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error, count } = await query;
  return { data, error, count, page, limit };
}

export async function getProductById(id: string) {
  if (!isSupabaseConfigured()) {
    const product = MOCK_PRODUCTS.find((p) => p.id === id && p.is_active);
    return { data: product ?? null, error: product ? null : "Not found" };
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select(
      `*,
      product_options(id, name, additional_price, stock, is_active),
      product_images(id, url, alt_text, sort_order),
      product_tags(id, tag),
      reviews(id, user_id, rating, content, created_at, users(name), review_images(id, url, sort_order))`
    )
    .eq("id", id)
    .eq("is_active", true)
    .single();

  return { data: product, error };
}

export async function searchProducts(query: string, page = 1, limit = 20) {
  if (!isSupabaseConfigured()) {
    const q = query.toLowerCase();
    const filtered = MOCK_PRODUCTS.filter(
      (p) =>
        p.is_active &&
        (p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.product_tags.some((t) => t.tag.toLowerCase().includes(q)))
    );
    const from = (page - 1) * limit;
    const sliced = filtered.slice(from, from + limit);
    return { data: sliced, error: null, count: sliced.length, page, limit };
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from("products")
    .select(
      `*, product_images(id, url, alt_text, sort_order), product_tags(id, tag)`,
      { count: "exact" }
    )
    .eq("is_active", true)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order("created_at", { ascending: false })
    .range(from, to);

  const { data: tagProducts } = await supabase
    .from("product_tags")
    .select("product_id")
    .ilike("tag", `%${query}%`);

  const tagProductIds = tagProducts?.map((t) => t.product_id) ?? [];

  let allProducts = data ?? [];
  if (tagProductIds.length > 0) {
    const existingIds = new Set(allProducts.map((p) => p.id));
    const newIds = tagProductIds.filter((id) => !existingIds.has(id));
    if (newIds.length > 0) {
      const { data: tagMatchedProducts } = await supabase
        .from("products")
        .select(
          `*, product_images(id, url, alt_text, sort_order), product_tags(id, tag)`
        )
        .eq("is_active", true)
        .in("id", newIds);
      if (tagMatchedProducts) {
        allProducts = [...allProducts, ...tagMatchedProducts];
      }
    }
  }

  return { data: allProducts, error, count: allProducts.length, page, limit };
}
