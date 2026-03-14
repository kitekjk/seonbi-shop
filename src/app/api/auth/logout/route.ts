import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/mock-data";

export async function POST() {
  // Mock mode: clear mock-auth cookie
  if (!isSupabaseConfigured()) {
    const response = NextResponse.json({ message: "로그아웃 되었습니다." });
    response.cookies.set("mock-auth", "", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 0,
    });
    return response;
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "로그아웃 되었습니다." });
}
