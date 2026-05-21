import { getCategoryById } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  TreePine,
  Waves,
  Palette,
  Users,
  GraduationCap,
  Dumbbell,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  TreePine,
  Waves,
  Palette,
  Users,
  GraduationCap,
  Dumbbell,
};

interface CategoryBadgeProps {
  categoryId: string;
  size?: "sm" | "md";
  className?: string;
}

export default function CategoryBadge({
  categoryId,
  size = "sm",
  className,
}: CategoryBadgeProps) {
  const category = getCategoryById(categoryId);
  if (!category) return null;

  const Icon = iconMap[category.icon] ?? Waves;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm",
        className
      )}
      style={{
        backgroundColor: category.bgColor,
        color: category.textColor,
      }}
    >
      <Icon className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />
      {category.name}
    </span>
  );
}
