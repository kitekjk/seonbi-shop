import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ChatWidget } from "@/components/chat-widget";
import "./globals.css";

export const metadata: Metadata = {
  title: "선비샵 — 한국 전통 기념품 쇼핑몰",
  description:
    "조선시대 선비의 풍류를 현대적으로 재해석한 전통 기념품 쇼핑몰. 도자기, 한복 소품, 전통문양 굿즈를 만나보세요.",
  openGraph: {
    title: "선비샵 — 한국 전통 기념품 쇼핑몰",
    description: "한국 전통의 아름다움을 현대적으로 재해석한 기념품 쇼핑몰",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col bg-white text-stone-900 antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
