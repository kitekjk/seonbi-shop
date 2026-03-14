import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured, MOCK_USER } from "@/lib/mock-data";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password, name } = body;

  if (!email || !password || !name) {
    return NextResponse.json(
      { error: "이메일, 비밀번호, 이름은 필수입니다." },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "비밀번호는 6자 이상이어야 합니다." },
      { status: 400 }
    );
  }

  // Mock mode: return success without Supabase
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        message: "회원가입이 완료되었습니다.",
        user: {
          id: MOCK_USER.id,
          email,
          user_metadata: { name },
        },
      },
      { status: 201 }
    );
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(
    { message: "회원가입이 완료되었습니다.", user: data.user },
    { status: 201 }
  );
}
