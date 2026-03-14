import Link from "next/link";
import { StarRating } from "./star-rating";

export interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  rating: number;
  reviewCount: number;
  tags?: string[];
}

export function ProductCard({
  id,
  name,
  price,
  imageUrl,
  category,
  rating,
  reviewCount,
  tags,
}: ProductCardProps) {
  return (
    <Link href={`/products/${id}`} className="group block">
      <div className="overflow-hidden rounded-lg border border-stone-200 bg-white transition-shadow hover:shadow-lg">
        <div className="aspect-square bg-brand-cream flex items-center justify-center overflow-hidden">
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-cream to-brand-cream-dark text-brand-navy text-sm">
            {/* TODO: Replace with actual product image */}
            <span className="text-4xl">🏺</span>
          </div>
        </div>
        <div className="p-4">
          <p className="text-xs font-medium text-brand-gold">{category}</p>
          <h3 className="mt-1 text-sm font-semibold text-stone-900 group-hover:text-brand-red transition-colors line-clamp-2">
            {name}
          </h3>
          <div className="mt-2 flex items-center gap-1.5">
            <StarRating rating={rating} size="sm" />
            <span className="text-xs text-stone-400">({reviewCount})</span>
          </div>
          <p className="mt-2 text-lg font-bold text-brand-navy">
            {price.toLocaleString("ko-KR")}원
          </p>
          {tags && tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-brand-cream px-2 py-0.5 text-xs text-brand-gold-dark"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
