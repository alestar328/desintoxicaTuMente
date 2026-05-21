import { cn } from "@/lib/utils";

interface PriceBadgeProps {
  priceType: "free" | "paid";
  priceLabel: string;
  className?: string;
}

export default function PriceBadge({ priceType, priceLabel, className }: PriceBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold",
        priceType === "free"
          ? "bg-green/10 text-green-700"
          : "bg-white/90 text-ink",
        className
      )}
      style={
        priceType === "free"
          ? { backgroundColor: "#dcfce7", color: "#15803d" }
          : { backgroundColor: "rgba(255,255,255,0.9)", color: "#1A1A2E" }
      }
    >
      {priceLabel}
    </span>
  );
}
