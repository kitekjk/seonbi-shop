import { createClient } from "@/lib/supabase/server";

export async function validateCoupon(
  code: string,
  userId: string,
  productIds?: string[]
) {
  const supabase = await createClient();

  const { data: coupon, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", code)
    .eq("is_active", true)
    .single();

  if (error || !coupon) {
    return { valid: false, error: "존재하지 않는 쿠폰입니다." };
  }

  const now = new Date().toISOString();
  if (coupon.starts_at > now) {
    return { valid: false, error: "아직 사용할 수 없는 쿠폰입니다." };
  }
  if (coupon.expires_at < now) {
    return { valid: false, error: "만료된 쿠폰입니다." };
  }
  if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses) {
    return { valid: false, error: "쿠폰 사용 한도를 초과했습니다." };
  }

  // Check if user already used this coupon
  const { data: userCoupon } = await supabase
    .from("user_coupons")
    .select("id, is_used")
    .eq("user_id", userId)
    .eq("coupon_id", coupon.id)
    .single();

  if (userCoupon?.is_used) {
    return { valid: false, error: "이미 사용한 쿠폰입니다." };
  }

  // Check product-specific coupon
  if (coupon.product_id && productIds) {
    if (!productIds.includes(coupon.product_id)) {
      return { valid: false, error: "해당 상품에 적용할 수 없는 쿠폰입니다." };
    }
  }

  return { valid: true, coupon };
}

export async function getUserCoupons(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_coupons")
    .select(`*, coupons(*)`)
    .eq("user_id", userId)
    .eq("is_used", false);

  // Filter to only return active, non-expired coupons
  const now = new Date().toISOString();
  const activeCoupons =
    data?.filter((uc) => {
      const c = uc.coupons as { is_active: boolean; expires_at: string } | null;
      return c && c.is_active && c.expires_at > now;
    }) ?? [];

  return { data: activeCoupons, error };
}
