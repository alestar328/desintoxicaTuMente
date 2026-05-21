import Image from "next/image";
import { getCategoryById } from "@/lib/mock-data";
import { TreePine, Waves, Palette, Users, GraduationCap, Dumbbell } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  TreePine,
  Waves,
  Palette,
  Users,
  GraduationCap,
  Dumbbell,
};

interface ActivityImagePlaceholderProps {
  categoryId: string;
  imageColor: string;
  imagePath?: string;
  alt?: string;
  className?: string;
}

export default function ActivityImagePlaceholder({
  categoryId,
  imageColor,
  imagePath,
  alt = "",
  className = "",
}: ActivityImagePlaceholderProps) {
  const category = getCategoryById(categoryId);
  const Icon = category ? (iconMap[category.icon] ?? Waves) : Waves;

  if (imagePath) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={imagePath}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ backgroundColor: imageColor + "22" }}
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{ backgroundColor: imageColor + "33" }}
      >
        <Icon className="w-8 h-8" style={{ color: imageColor }} />
      </div>
    </div>
  );
}
