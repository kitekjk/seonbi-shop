"use client";

interface StatusOption {
  value: string;
  label: string;
  color: string;
}

interface StatusSelectProps {
  value: string;
  options: StatusOption[];
  onChange: (value: string) => void;
}

export default function StatusSelect({
  value,
  options,
  onChange,
}: StatusSelectProps) {
  const current = options.find((o) => o.value === value);

  return (
    <div className="relative inline-block">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-lg border border-stone-300 py-1.5 pr-8 pl-3 text-sm font-medium focus:border-[var(--color-brand-navy)] focus:ring-1 focus:ring-[var(--color-brand-navy)] focus:outline-none"
        style={{ color: current?.color }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} style={{ color: option.color }}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <svg className="h-4 w-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
