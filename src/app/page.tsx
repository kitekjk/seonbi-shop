import Link from "next/link";
import { ProductGrid } from "@/components/product-grid";
import type { ProductCardProps } from "@/components/product-card";
import { getProducts } from "@/lib/api/products";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProduct(p: any): ProductCardProps {
  const images = (p.product_images ?? []) as Array<{ url: string; sort_order: number }>;
  const tags = (p.product_tags ?? []) as Array<{ tag: string }>;
  return {
    id: p.id,
    name: p.name,
    price: p.base_price,
    imageUrl: images.sort((a, b) => a.sort_order - b.sort_order)[0]?.url ?? "",
    category: p.category,
    rating: 0,
    reviewCount: 0,
    tags: tags.map((t) => t.tag),
  };
}

export default async function HomePage() {
  let featuredProducts: ProductCardProps[] = [];
  try {
    const { data } = await getProducts({ page: 1, limit: 8 });
    featuredProducts = (data ?? []).map(mapProduct);
  } catch {
    // Supabase not configured
  }

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-navy to-brand-navy-dark">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 py-24 text-center">
          <p className="text-sm font-medium tracking-widest text-brand-gold-light uppercase">
            Korean Traditional Gift Shop
          </p>
          <h1 className="mt-4 text-5xl font-bold tracking-tight text-white leading-tight">
            한국 전통의 아름다움을
            <br />
            <span className="text-brand-gold-light">일상에서 만나다</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100">
            조선시대 선비의 풍류부터 고려청자의 비색까지,
            <br />
            전통을 현대적으로 재해석한 기념품을 소개합니다.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/products"
              className="rounded-lg bg-brand-gold px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-brand-gold-light hover:shadow-xl"
            >
              상품 둘러보기
            </Link>
            <Link
              href="/events"
              className="rounded-lg border-2 border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/10"
            >
              이벤트 보기
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-medium text-brand-gold">Best Items</p>
            <h2 className="mt-1 text-2xl font-bold text-stone-900">인기 상품</h2>
          </div>
          <Link
            href="/products"
            className="text-sm font-medium text-brand-navy hover:text-brand-navy-light transition-colors"
          >
            전체보기 →
          </Link>
        </div>
        <div className="mt-8">
          <ProductGrid products={featuredProducts} />
        </div>
      </section>

      {/* Event Banner */}
      <section className="bg-brand-cream">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-brand-red to-brand-red-light p-10 text-white shadow-lg">
            <div>
              <p className="text-sm font-medium text-red-200">진행중인 이벤트</p>
              <h3 className="mt-2 text-2xl font-bold">봄맞이 전통 기념품 대전</h3>
              <p className="mt-2 text-red-100">
                봄을 맞아 선비샵의 인기 상품을 특별 할인가에 만나보세요.
                <br />
                최대 30% 할인 + 무료배송 쿠폰 증정!
              </p>
              <Link
                href="/events/event-001"
                className="mt-6 inline-block rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-brand-red transition-colors hover:bg-red-50"
              >
                이벤트 참여하기
              </Link>
            </div>
            <div className="hidden lg:flex items-center justify-center text-8xl opacity-80">
              🎎
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center text-2xl font-bold text-stone-900">카테고리별 쇼핑</h2>
        <div className="mt-8 grid grid-cols-4 gap-6">
          {[
            { emoji: "🏺", name: "도자기", href: "/products?category=도자기" },
            { emoji: "📜", name: "한지공예", href: "/products?category=한지공예" },
            { emoji: "🍶", name: "전통주잔", href: "/products?category=전통주잔" },
            { emoji: "👘", name: "한복", href: "/products?category=한복" },
          ].map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group flex flex-col items-center rounded-xl border border-stone-200 bg-white p-8 transition-all hover:border-brand-gold hover:shadow-md"
            >
              <span className="text-4xl">{cat.emoji}</span>
              <span className="mt-3 text-sm font-semibold text-stone-700 group-hover:text-brand-navy">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
