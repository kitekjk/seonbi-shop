"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function getAuthUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function getCart() {
  const userId = await getAuthUserId();
  if (!userId) return { error: "로그인이 필요합니다.", data: null };

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
  const userId = await getAuthUserId();
  if (!userId) return { error: "로그인이 필요합니다." };

  if (quantity < 1) return { error: "수량은 1개 이상이어야 합니다." };

  const supabase = await createClient();

  // Check if product exists and is active
  const { data: product } = await supabase
    .from("products")
    .select("id")
    .eq("id", productId)
    .eq("is_active", true)
    .single();

  if (!product) return { error: "상품을 찾을 수 없습니다." };

  // Check option stock if option specified
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

  // Check if already in cart
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
  const userId = await getAuthUserId();
  if (!userId) return { error: "로그인이 필요합니다." };

  if (quantity < 1) return { error: "수량은 1개 이상이어야 합니다." };

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
  const userId = await getAuthUserId();
  if (!userId) return { error: "로그인이 필요합니다." };

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
  const userId = await getAuthUserId();
  if (!userId) return { error: "로그인이 필요합니다." };

  const supabase = await createClient();

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", userId);

  if (error) return { error: error.message };

  revalidatePath("/cart");
  return { error: null };
}
