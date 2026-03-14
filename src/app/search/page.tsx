import { ProductGrid } from "@/components/product-grid";
import { SearchBar } from "@/components/search-bar";
import type { ProductCardProps } from "@/components/product-card";
import { searchProducts } from "@/lib/api/products";

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

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q ?? "";

  let results: ProductCardProps[] = [];

  if (query) {
    try {
      const { data } = await searchProducts(query);
      results = (data ?? []).map(mapProduct);
    } catch {
      // Supabase not configured
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold text-stone-900">검색</h1>

      <div className="mt-6">
        <SearchBar defaultValue={query} />
      </div>

      {query ? (
        <>
          <p className="mt-8 text-sm text-stone-500">
            <span className="font-semibold text-brand-navy">&quot;{query}&quot;</span>에 대한
            검색결과{" "}
            <span className="font-semibold text-stone-900">{results.length}</span>건
          </p>

          {results.length > 0 ? (
            <div className="mt-6">
              <ProductGrid products={results} />
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-5xl">🔍</p>
              <p className="mt-4 text-lg font-medium text-stone-500">검색 결과가 없습니다</p>
              <p className="mt-2 text-sm text-stone-400">다른 검색어로 다시 시도해보세요</p>
            </div>
          )}
        </>
      ) : (
        <div className="py-20 text-center">
          <p className="text-5xl">🏺</p>
          <p className="mt-4 text-lg font-medium text-stone-500">원하시는 상품을 검색해보세요</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {["청자", "소주잔", "나전칠기", "한복", "부채", "도자기"].map((tag) => (
              <a
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="rounded-full border border-stone-200 px-4 py-2 text-sm text-stone-600 transition-colors hover:border-brand-gold hover:text-brand-gold-dark"
              >
                #{tag}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
