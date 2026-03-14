import { requireAuth, errorResponse, successResponse } from "@/lib/api/helpers";
import { validateCoupon } from "@/lib/api/coupons";
import { calculateDiscount } from "@/lib/api/orders";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { user, error: authError } = await requireAuth();
  if (authError) return authError;

  const body = await request.json();
  const { code, product_ids, total_amount } = body;

  if (!code) return errorResponse("쿠폰 코드를 입력해주세요.");

  const result = await validateCoupon(code, user!.id, product_ids);

  if (!result.valid) {
    return errorResponse(result.error ?? "유효하지 않은 쿠폰입니다.");
  }

  const coupon = result.coupon!;
  const discount = total_amount
    ? calculateDiscount(coupon, total_amount)
    : null;

  return successResponse({
    valid: true,
    coupon: {
      id: coupon.id,
      code: coupon.code,
      name: coupon.name,
      type: coupon.type,
      discount_value: coupon.discount_value,
      min_order_amount: coupon.min_order_amount,
      max_discount_amount: coupon.max_discount_amount,
    },
    calculated_discount: discount,
  });
}
