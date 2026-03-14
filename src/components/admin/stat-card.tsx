"use client";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
}

export default function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
}: StatCardProps) {
  const changeColor = {
    positive: "text-green-600",
    negative: "text-red-600",
    neutral: "text-stone-500",
  }[changeType];

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-stone-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-stone-900">{value}</p>
          {change && (
            <p className={`mt-1 text-sm font-medium ${changeColor}`}>
              {change}
            </p>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-brand-navy)]/10 text-[var(--color-brand-navy)]">
          {icon}
        </div>
      </div>
    </div>
  );
}
