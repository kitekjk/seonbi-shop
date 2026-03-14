import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured, MOCK_USER } from "@/lib/mock-data";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: "이메일과 비밀번호를 입력해주세요." },
      { status: 400 }
    );
  }

  // Mock mode: return mock user without Supabase
  if (!isSupabaseConfigured()) {
    const mockUser = { id: MOCK_USER.id, email: MOCK_USER.email, name: MOCK_USER.name };
    const response = NextResponse.json({
      message: "로그인 성공",
      user: {
        id: MOCK_USER.id,
        email: MOCK_USER.email,
        user_metadata: { name: MOCK_USER.name },
      },
      session: {
        access_token: "mock-access-token",
        refresh_token: "mock-refresh-token",
        expires_in: 3600,
      },
    });
    response.cookies.set("mock-auth", JSON.stringify(mockUser), {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: "이메일 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
  }

  return NextResponse.json({
    message: "로그인 성공",
    user: data.user,
    session: data.session,
  });
}
