import { StarRating } from "./star-rating";

export interface ReviewItem {
  id: string;
  userName: string;
  rating: number;
  content: string;
  createdAt: string;
  images?: string[];
}

interface ReviewListProps {
  reviews: ReviewItem[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-stone-400">아직 리뷰가 없습니다.</p>
        <p className="mt-1 text-sm text-stone-400">
          첫 번째 리뷰를 작성해보세요!
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-stone-100">
      {reviews.map((review) => (
        <div key={review.id} className="py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-cream text-sm font-semibold text-brand-navy">
                {review.userName.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-stone-900">
                  {review.userName}
                </p>
                <StarRating rating={review.rating} size="sm" />
              </div>
            </div>
            <p className="text-xs text-stone-400">
              {new Date(review.createdAt).toLocaleDateString("ko-KR")}
            </p>
          </div>
          <p className="mt-3 text-sm text-stone-700 leading-relaxed">
            {review.content}
          </p>
          {review.images && review.images.length > 0 && (
            <div className="mt-3 flex gap-2">
              {review.images.map((img, idx) => (
                <div
                  key={idx}
                  className="h-20 w-20 rounded-md bg-brand-cream flex items-center justify-center text-xs text-stone-400"
                >
                  {/* TODO: Replace with actual review image */}
                  사진
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
