import { searchProducts } from "@/lib/api/products";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "20", 10);

  if (!q || q.trim().length === 0) {
    return NextResponse.json({ error: "검색어를 입력해주세요." }, { status: 400 });
  }

  const { data, error, count } = await searchProducts(
    q.trim(),
    Math.max(1, page),
    Math.min(100, Math.max(1, limit))
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total: count ?? 0,
      totalPages: Math.ceil((count ?? 0) / limit),
    },
    query: q,
  });
}
