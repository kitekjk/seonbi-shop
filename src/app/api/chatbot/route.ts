import { getAuthUser } from "@/lib/api/helpers";
import { isSupabaseConfigured } from "@/lib/mock-data";
import { NextRequest, NextResponse } from "next/server";

// Simple FAQ-based chatbot
const FAQ: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["배송", "얼마나", "며칠", "기간"],
    answer:
      "일반 배송은 결제 완료 후 2~3 영업일 이내에 발송되며, 발송 후 1~2일 내 수령 가능합니다.",
  },
  {
    keywords: ["배송", "어디", "조회", "확인", "추적"],
    answer:
      "주문내역 페이지에서 운송장 번호를 확인하실 수 있으며, 배송조회 버튼을 클릭하면 실시간 배송 상태를 확인할 수 있습니다.",
  },
  {
    keywords: ["교환", "반품", "환불"],
    answer:
      "상품 수령 후 7일 이내 교환/반품 가능합니다. 단순 변심의 경우 왕복 배송비(6,000원)가 부과됩니다. 상품 하자의 경우 무료 교환/반품 처리됩니다.",
  },
  {
    keywords: ["결제", "카드", "계좌"],
    answer:
      "신용카드, 체크카드, 무통장입금(가상계좌)을 지원합니다. (데모 환경에서는 Mock 결제로 처리됩니다.)",
  },
  {
    keywords: ["쿠폰", "할인"],
    answer:
      "마이페이지 > 쿠폰함에서 보유 쿠폰을 확인하실 수 있습니다. 주문 시 쿠폰 코드를 입력하면 할인이 적용됩니다.",
  },
  {
    keywords: ["취소", "주문취소"],
    answer:
      "배송 준비 전(결제완료 상태)까지 주문 취소가 가능합니다. 주문내역에서 '주문취소' 버튼을 클릭해주세요.",
  },
  {
    keywords: ["회원", "가입", "탈퇴"],
    answer:
      "회원가입은 이메일과 비밀번호로 간단하게 가능합니다. 회원 탈퇴는 마이페이지에서 처리할 수 있습니다.",
  },
  {
    keywords: ["영업", "시간", "운영"],
    answer:
      "고객센터 운영시간은 평일 09:00~18:00 (점심시간 12:00~13:00)입니다. 주말 및 공휴일은 휴무입니다.",
  },
];

function findAnswer(message: string): string | null {
  const normalizedMsg = message.toLowerCase();

  for (const faq of FAQ) {
    const matchCount = faq.keywords.filter((kw) =>
      normalizedMsg.includes(kw)
    ).length;
    if (matchCount >= 1) {
      return faq.answer;
    }
  }

  return null;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { message, session_id } = body;

  if (!message || !session_id) {
    return NextResponse.json(
      { error: "메시지와 세션 ID는 필수입니다." },
      { status: 400 }
    );
  }

  // Mock mode: return FAQ answers without logging to Supabase
  if (!isSupabaseConfigured()) {
    const answer = findAnswer(message);

    if (answer) {
      return NextResponse.json({
        role: "bot",
        message: answer,
        escalated: false,
      });
    }

    return NextResponse.json({
      role: "bot",
      message:
        "죄송합니다. 해당 문의는 상담원에게 전달하겠습니다. 잠시만 기다려주세요.",
      escalated: true,
    });
  }

  const user = await getAuthUser();
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  // Log user message
  await supabase.from("chat_logs").insert({
    user_id: user?.id ?? null,
    session_id,
    role: "user",
    message,
    escalated: false,
  });

  // Find FAQ answer
  const answer = findAnswer(message);

  if (answer) {
    // Log bot response
    await supabase.from("chat_logs").insert({
      user_id: user?.id ?? null,
      session_id,
      role: "bot",
      message: answer,
      escalated: false,
    });

    return NextResponse.json({
      role: "bot",
      message: answer,
      escalated: false,
    });
  }

  // Escalate to admin
  const escalationMessage =
    "죄송합니다. 해당 문의는 상담원에게 전달하겠습니다. 잠시만 기다려주세요.";

  await supabase.from("chat_logs").insert({
    user_id: user?.id ?? null,
    session_id,
    role: "bot",
    message: escalationMessage,
    escalated: true,
  });

  return NextResponse.json({
    role: "bot",
    message: escalationMessage,
    escalated: true,
  });
}
