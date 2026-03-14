"use client";

import { useState, useRef } from "react";

interface ChatMessage {
  role: "user" | "bot";
  message: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    role: "bot",
    message:
      "안녕하세요! 선비샵 고객센터입니다. 무엇을 도와드릴까요?\n\n1. 배송 조회\n2. 교환/반품 안내\n3. 상품 문의\n4. 기타 문의",
  },
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const sessionIdRef = useRef(`session-${Date.now()}`);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", message: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentInput,
          session_id: sessionIdRef.current,
        }),
      });

      const json = await res.json();
      if (json.message) {
        setMessages((prev) => [...prev, { role: "bot", message: json.message }]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", message: "죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-navy text-white shadow-lg transition-transform hover:scale-105 hover:bg-brand-navy-light"
      >
        {isOpen ? <span className="text-xl">✕</span> : <span className="text-2xl">💬</span>}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[480px] w-[360px] flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-2xl">
          <div className="bg-brand-navy px-4 py-3">
            <h3 className="text-sm font-semibold text-white">선비샵 고객센터</h3>
            <p className="text-xs text-blue-200">평일 10:00 - 18:00 운영</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-brand-navy text-white"
                      : "bg-stone-100 text-stone-800"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg px-3 py-2 text-sm bg-stone-100 text-stone-400">
                  답변을 준비하고 있습니다...
                </div>
              </div>
            )}
          </div>
          <div className="border-t border-stone-200 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="메시지를 입력하세요..."
                disabled={isLoading}
                className="flex-1 rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="rounded-md bg-brand-navy px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-navy-light disabled:opacity-50"
              >
                전송
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
