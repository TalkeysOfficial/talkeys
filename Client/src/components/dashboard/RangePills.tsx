"use client";
import { cn } from "@/lib/utils";

type Range = "1m" | "6m" | "1y";
const opts: { v: Range; label: string }[] = [
  { v: "1m", label: "Last Month" },
  { v: "6m", label: "Last 6 Months" },
  { v: "1y", label: "Last Year" },
];

export default function RangePills({
  value,
  onChange,
}: {
  value: Range;
  onChange: (v: Range) => void;
}) {
  return (
    <div className="flex gap-4">
      {opts.map((o) => (
        <button
          key={o.v}
          onClick={() => onChange(o.v)}
          className={cn(
            "px-4 py-1 rounded-md text-sm",
            value === o.v
              ? "bg-purple-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
