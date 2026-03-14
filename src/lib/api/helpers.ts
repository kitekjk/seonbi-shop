import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isSupabaseConfigured, MOCK_USER, MOCK_ADMIN } from "@/lib/mock-data";

export async function getAuthUser() {
  if (!isSupabaseConfigured()) {
    const cookieStore = await cookies();
    const mockAuth = cookieStore.get("mock-auth");
    if (!mockAuth) return null;
    try {
      return JSON.parse(mockAuth.value) as { id: string; email: string; name?: string };
    } catch {
      return null;
    }
  }
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

export async function requireAuth() {
  const user = await getAuthUser();
  if (!user) {
    return { user: null, error: NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 }) };
  }
  return { user, error: null };
}

export async function requireAdmin() {
  if (!isSupabaseConfigured()) {
    const user = await getAuthUser();
    if (!user) {
      return { user: null, error: NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 }) };
    }
    // In mock mode, check if user is the mock admin
    if (user.id === MOCK_ADMIN.id) {
      return { user, error: null };
    }
    return { user: null, error: NextResponse.json({ error: "관리자 권한이 필요합니다." }, { status: 403 }) };
  }
  const user = await getAuthUser();
  if (!user) {
    return { user: null, error: NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 }) };
  }
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!profile || profile.role !== "admin") {
    return { user: null, error: NextResponse.json({ error: "관리자 권한이 필요합니다." }, { status: 403 }) };
  }
  return { user, error: null };
}

export function errorResponse(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function successResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status });
}
