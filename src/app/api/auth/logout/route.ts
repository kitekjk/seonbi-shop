import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/mock-data";

export async function POST() {
  // Mock mode: return success without Supabase
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ message: "로그아웃 되었습니다." });
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "로그아웃 되었습니다." });
}
