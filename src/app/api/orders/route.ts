import { requireAuth, errorResponse, successResponse } from "@/lib/api/helpers";
import {
  generateOrderNumber,
  generateTransactionId,
  getUserOrders,
  calculateDiscount,
} from "@/lib/api/orders";
import { isSupabaseConfigured, MOCK_PRODUCTS, MOCK_COUPONS, MOCK_USER_COUPONS } from "@/lib/mock-data";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { user, error: authError } = await requireAuth();
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "20", 10);

  const { data, error, count } = await getUserOrders(user!.id, page, limit);

  if (error) return errorResponse(error.message, 500);

  return successResponse({
    data,
    pagination: { page, limit, total: count ?? 0, totalPages: Math.ceil((count ?? 0) / limit) },
  });
}

export async function POST(request: NextRequest) {
  const { user, error: authError } = await requireAuth();
  if (authError) return authError;

  const body = await request.json();
  const {
    items,
    recipient_name,
    phone,
    postal_code,
    address_line1,
    address_line2,
    coupon_code,
    payment_method = "mock_card",
    note,
  } = body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return errorResponse("주문 상품을 선택해주세요.");
  }
  if (!recipient_name || !phone || !postal_code || !address_line1) {
    return errorResponse("배송지 정보를 입력해주세요.");
  }

  // Mock mode: create order from mock data
  if (!isSupabaseConfigured()) {
    const resolvedItems: {
      product_id: string;
      option_id: string | null;
      product_name: string;
      option_name: string | null;
      quantity: number;
      unit_price: number;
      total_price: number;
    }[] = [];

    let totalAmount = 0;

    for (const item of items) {
      const product = MOCK_PRODUCTS.find((p) => p.id === item.product_id && p.is_active);
      if (!product) return errorResponse(`상품을 찾을 수 없습니다: ${item.product_id}`);

      let unitPrice = product.base_price;
      let optionName: string | null = null;

      if (item.option_id) {
        const option = product.product_options.find((o) => o.id === item.option_id && o.is_active);
        if (!option) return errorResponse("옵션을 찾을 수 없습니다.");
        if (option.stock < item.quantity) return errorResponse(`재고 부족: ${option.name}`);
        unitPrice += option.additional_price;
        optionName = option.name;
      }

      const itemTotal = unitPrice * item.quantity;
      totalAmount += itemTotal;

      resolvedItems.push({
        product_id: item.product_id,
        option_id: item.option_id ?? null,
        product_name: product.name,
        option_name: optionName,
        quantity: item.quantity,
        unit_price: unitPrice,
        total_price: itemTotal,
      });
    }

    // Apply coupon in mock mode
    let discountAmount = 0;
    let couponId: string | null = null;

    if (coupon_code) {
      const coupon = MOCK_COUPONS.find((c) => c.code === coupon_code && c.is_active);
      if (!coupon) return errorResponse("유효하지 않은 쿠폰입니다.");

      const now = new Date().toISOString();
      if (coupon.starts_at > now || coupon.expires_at < now) {
        return errorResponse("사용 기간이 아닌 쿠폰입니다.");
      }

      const userCoupon = MOCK_USER_COUPONS.find(
        (uc) => uc.user_id === user!.id && uc.coupon_id === coupon.id
      );
      if (userCoupon?.is_used) return errorResponse("이미 사용한 쿠폰입니다.");

      discountAmount = calculateDiscount(coupon, totalAmount);
      couponId = coupon.id;
    }

    const shippingFee = totalAmount >= 50000 ? 0 : 3000;
    const finalAmount = totalAmount - discountAmount + shippingFee;
    const orderNumber = generateOrderNumber();
    const transactionId = generateTransactionId();

    const mockOrder = {
      id: `order-mock-${Date.now()}`,
      user_id: user!.id,
      order_number: orderNumber,
      status: "payment_completed",
      recipient_name,
      phone,
      postal_code,
      address_line1,
      address_line2: address_line2 ?? null,
      total_amount: totalAmount,
      discount_amount: discountAmount,
      shipping_fee: shippingFee,
      final_amount: finalAmount,
      coupon_id: couponId,
      note: note ?? null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      order_items: resolvedItems,
    };

    return successResponse(
      {
        message: "주문이 완료되었습니다.",
        order: mockOrder,
        payment: { status: "completed", transaction_id: transactionId },
      },
      201
    );
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  // Resolve cart items or direct items
  const orderItems: {
    product_id: string;
    option_id: string | null;
    quantity: number;
  }[] = items;

  // Calculate totals
  let totalAmount = 0;
  const resolvedItems: {
    product_id: string;
    option_id: string | null;
    product_name: string;
    option_name: string | null;
    quantity: number;
    unit_price: number;
    total_price: number;
  }[] = [];

  for (const item of orderItems) {
    const { data: product } = await supabase
      .from("products")
      .select("id, name, base_price, is_active")
      .eq("id", item.product_id)
      .eq("is_active", true)
      .single();

    if (!product) return errorResponse(`상품을 찾을 수 없습니다: ${item.product_id}`);

    let unitPrice = product.base_price;
    let optionName: string | null = null;

    if (item.option_id) {
      const { data: option } = await supabase
        .from("product_options")
        .select("id, name, additional_price, stock, is_active")
        .eq("id", item.option_id)
        .eq("product_id", item.product_id)
        .single();

      if (!option || !option.is_active) return errorResponse("옵션을 찾을 수 없습니다.");
      if (option.stock < item.quantity) return errorResponse(`재고 부족: ${option.name}`);

      unitPrice += option.additional_price;
      optionName = option.name;
    }

    const itemTotal = unitPrice * item.quantity;
    totalAmount += itemTotal;

    resolvedItems.push({
      product_id: item.product_id,
      option_id: item.option_id ?? null,
      product_name: product.name,
      option_name: optionName,
      quantity: item.quantity,
      unit_price: unitPrice,
      total_price: itemTotal,
    });
  }

  // Apply coupon
  let discountAmount = 0;
  let couponId: string | null = null;

  if (coupon_code) {
    const { data: coupon } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", coupon_code)
      .eq("is_active", true)
      .single();

    if (!coupon) return errorResponse("유효하지 않은 쿠폰입니다.");

    const now = new Date().toISOString();
    if (coupon.starts_at > now || coupon.expires_at < now) {
      return errorResponse("사용 기간이 아닌 쿠폰입니다.");
    }
    if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses) {
      return errorResponse("쿠폰 사용 한도를 초과했습니다.");
    }

    // Check user coupon
    const { data: userCoupon } = await supabase
      .from("user_coupons")
      .select("id, is_used")
      .eq("user_id", user!.id)
      .eq("coupon_id", coupon.id)
      .maybeSingle();

    if (userCoupon?.is_used) return errorResponse("이미 사용한 쿠폰입니다.");

    discountAmount = calculateDiscount(coupon, totalAmount);
    couponId = coupon.id;
  }

  const shippingFee = totalAmount >= 50000 ? 0 : 3000;
  const finalAmount = totalAmount - discountAmount + shippingFee;

  // Create order
  const orderNumber = generateOrderNumber();
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user!.id,
      order_number: orderNumber,
      status: "payment_completed",
      recipient_name,
      phone,
      postal_code,
      address_line1,
      address_line2: address_line2 ?? null,
      total_amount: totalAmount,
      discount_amount: discountAmount,
      shipping_fee: shippingFee,
      final_amount: finalAmount,
      coupon_id: couponId,
      note: note ?? null,
    })
    .select()
    .single();

  if (orderError) return errorResponse(orderError.message, 500);

  // Create order items
  const { error: itemsError } = await supabase.from("order_items").insert(
    resolvedItems.map((item) => ({
      order_id: order.id,
      ...item,
    }))
  );

  if (itemsError) return errorResponse(itemsError.message, 500);

  // Deduct stock for options
  for (const item of resolvedItems) {
    if (item.option_id) {
      const { data: opt } = await supabase
        .from("product_options")
        .select("stock")
        .eq("id", item.option_id)
        .single();
      if (opt) {
        await supabase
          .from("product_options")
          .update({ stock: opt.stock - item.quantity })
          .eq("id", item.option_id);
      }
    }
  }

  // Mock payment (90% success rate)
  const paymentSuccess = Math.random() > 0.1;
  const transactionId = generateTransactionId();

  const { error: paymentError } = await supabase.from("payments").insert({
    order_id: order.id,
    method: payment_method,
    amount: finalAmount,
    status: paymentSuccess ? "completed" : "failed",
    transaction_id: transactionId,
    paid_at: paymentSuccess ? new Date().toISOString() : null,
  });

  if (paymentError) return errorResponse(paymentError.message, 500);

  if (!paymentSuccess) {
    await supabase.from("orders").update({ status: "cancelled" }).eq("id", order.id);
    return errorResponse("결제에 실패했습니다. 다시 시도해주세요.", 402);
  }

  // Create shipment record
  await supabase.from("shipments").insert({
    order_id: order.id,
    carrier: "한진택배",
    status: "preparing",
  });

  // Mark coupon as used
  if (couponId) {
    await supabase
      .from("user_coupons")
      .update({ is_used: true, used_at: new Date().toISOString() })
      .eq("user_id", user!.id)
      .eq("coupon_id", couponId);

    await supabase
      .from("coupons")
      .update({ used_count: (await supabase.from("coupons").select("used_count").eq("id", couponId).single()).data!.used_count + 1 })
      .eq("id", couponId);
  }

  // Clear cart items that were ordered
  const productIds = resolvedItems.map((i) => i.product_id);
  await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", user!.id)
    .in("product_id", productIds);

  return successResponse(
    {
      message: "주문이 완료되었습니다.",
      order: { ...order, order_items: resolvedItems },
      payment: { status: "completed", transaction_id: transactionId },
    },
    201
  );
}
