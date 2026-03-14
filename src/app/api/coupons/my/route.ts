import { requireAuth, errorResponse, successResponse } from "@/lib/api/helpers";
import { getUserCoupons } from "@/lib/api/coupons";

export async function GET() {
  const { user, error: authError } = await requireAuth();
  if (authError) return authError;

  const { data, error } = await getUserCoupons(user!.id);

  if (error) return errorResponse(error.message, 500);

  return successResponse({ data });
}
