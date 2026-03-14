"use server";

import { revalidatePath } from "next/cache";
import {
  isSupabaseConfigured,
  getMockCart,
  addMockCartItem,
  updateMockCartQuantity,
  removeMockCartItem,
  clearMockCart,
} from "@/lib/mock-data";

async function getAuthUserId(): Promise<string | null> {
  if (!isSupabaseConfigured()) {
    const { MOCK_USER } = await import("@/lib/mock-data");
    return MOCK_USER.id;
  }
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function getCart() {
  if (!isSupabaseConfigured()) {
    return { data: getMockCart(), error: null };
  }

  const userId = await getAuthUserId();
  if (!userId) return { error: "로그인이 필요합니다.", data: null };

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cart_items")
    .select(
      `*, products(id, name, base_price, is_active, product_images(url, sort_order)), product_options(id, name, additional_price, stock)`
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return { error: error.message, data: null };
  return { data, error: null };
}

export async function addToCart(
  productId: string,
  quantity: number = 1,
  optionId?: string
) {
  if (!isSupabaseConfigured()) {
    const result = addMockCartItem(productId, quantity, optionId);
    if (!result.error) revalidatePath("/cart");
    return result;
  }

  const userId = await getAuthUserId();
  if (!userId) return { error: "로그인이 필요합니다." };

  if (quantity < 1) return { error: "수량은 1개 이상이어야 합니다." };

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("id")
    .eq("id", productId)
    .eq("is_active", true)
    .single();

  if (!product) return { error: "상품을 찾을 수 없습니다." };

  if (optionId) {
    const { data: option } = await supabase
      .from("product_options")
      .select("*")
      .eq("id", optionId)
      .eq("product_id", productId)
      .single();

    if (!option || !option.is_active) return { error: "옵션을 찾을 수 없습니다." };
    if (option.stock < quantity) return { error: "재고가 부족합니다." };
  }

  const { data: cartRows } = await supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", userId)
    .eq("product_id", productId);

  const match = (cartRows ?? []).find((item) =>
    optionId ? item.option_id === optionId : item.option_id === null
  );

  if (match) {
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: match.quantity + quantity })
      .eq("id", match.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("cart_items").insert({
      user_id: userId,
      product_id: productId,
      option_id: optionId ?? null,
      quantity,
    });
    if (error) return { error: error.message };
  }

  revalidatePath("/cart");
  return { error: null };
}

export async function updateCartQuantity(cartItemId: string, quantity: number) {
  if (!isSupabaseConfigured()) {
    const result = updateMockCartQuantity(cartItemId, quantity);
    revalidatePath("/cart");
    return result;
  }

  const userId = await getAuthUserId();
  if (!userId) return { error: "로그인이 필요합니다." };

  if (quantity < 1) return { error: "수량은 1개 이상이어야 합니다." };

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", cartItemId)
    .eq("user_id", userId);

  if (error) return { error: error.message };

  revalidatePath("/cart");
  return { error: null };
}

export async function removeFromCart(cartItemId: string) {
  if (!isSupabaseConfigured()) {
    const result = removeMockCartItem(cartItemId);
    revalidatePath("/cart");
    return result;
  }

  const userId = await getAuthUserId();
  if (!userId) return { error: "로그인이 필요합니다." };

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", cartItemId)
    .eq("user_id", userId);

  if (error) return { error: error.message };

  revalidatePath("/cart");
  return { error: null };
}

export async function clearCart() {
  if (!isSupabaseConfigured()) {
    const result = clearMockCart();
    revalidatePath("/cart");
    return result;
  }

  const userId = await getAuthUserId();
  if (!userId) return { error: "로그인이 필요합니다." };

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", userId);

  if (error) return { error: error.message };

  revalidatePath("/cart");
  return { error: null };
}
