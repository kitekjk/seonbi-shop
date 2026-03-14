import Link from "next/link";
import { ProductGrid } from "@/components/product-grid";
import { Pagination } from "@/components/pagination";
import type { ProductCardProps } from "@/components/product-card";
import { getProducts } from "@/lib/api/products";

const CATEGORIES = ["전체", "도자기", "한지공예", "전통주잔", "한복", "액세서리"];
const PAGE_SIZE = 8;

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

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const currentCategory = params.category ?? "전체";
  const currentPage = Number(params.page ?? "1");

  let products: ProductCardProps[] = [];
  let totalCount = 0;

  try {
    const { data, count } = await getProducts({
      page: currentPage,
      limit: PAGE_SIZE,
      category: currentCategory === "전체" ? undefined : currentCategory,
    });
    products = (data ?? []).map(mapProduct);
    totalCount = count ?? 0;
  } catch {
    // Supabase not configured
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div>
        <h1 className="text-3xl font-bold text-stone-900">전체 상품</h1>
        <p className="mt-2 text-sm text-stone-500">
          선비샵의 모든 전통 기념품을 만나보세요
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={
              cat === "전체"
                ? "/products"
                : `/products?category=${encodeURIComponent(cat)}`
            }
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              currentCategory === cat
                ? "bg-brand-navy text-white"
                : "border border-stone-200 text-stone-600 hover:border-brand-navy hover:text-brand-navy"
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      <p className="mt-6 text-sm text-stone-500">
        총 <span className="font-semibold text-stone-900">{totalCount}</span>개 상품
      </p>

      <div className="mt-6">
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="py-20 text-center">
            <p className="text-stone-400">해당 카테고리에 상품이 없습니다.</p>
          </div>
        )}
      </div>

      <div className="mt-12">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/products"
          queryParams={
            currentCategory !== "전체" ? { category: currentCategory } : {}
          }
        />
      </div>
    </div>
  );
}
