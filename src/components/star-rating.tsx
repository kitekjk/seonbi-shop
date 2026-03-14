interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}

export function StarRating({
  rating,
  size = "md",
  showValue = false,
}: StarRatingProps) {
  const sizeClass = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-lg",
  }[size];

  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(
        <span key={i} className="text-brand-gold">
          ★
        </span>
      );
    } else if (i - 0.5 <= rating) {
      stars.push(
        <span key={i} className="text-brand-gold">
          ★
        </span>
      );
    } else {
      stars.push(
        <span key={i} className="text-stone-300">
          ★
        </span>
      );
    }
  }

  return (
    <span className={`inline-flex items-center gap-0.5 ${sizeClass}`}>
      {stars}
      {showValue && (
        <span className="ml-1 text-stone-600">{rating.toFixed(1)}</span>
      )}
    </span>
  );
}
