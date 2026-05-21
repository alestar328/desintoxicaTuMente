"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityChipProps {
  title: string;
  startTime: string;
  endTime: string;
  color: string;
  bgColor: string;
  status: "planned" | "confirmed" | "attended";
  onRemove?: () => void;
}

export default function ActivityChip({
  title,
  startTime,
  endTime,
  color,
  bgColor,
  status,
  onRemove,
}: ActivityChipProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-lg px-2.5 py-2 text-xs font-medium transition-all duration-200 cursor-default min-h-[44px]",
        status === "planned" ? "border-2 border-dashed" : "border-2 border-solid",
        status === "attended" ? "opacity-70" : ""
      )}
      style={{
        borderColor: color,
        backgroundColor: bgColor,
        color: color,
      }}
      title={`${title} · ${startTime}–${endTime}`}
    >
      <span className="font-semibold leading-tight line-clamp-1">{title}</span>
      <span className="text-[10px] opacity-80 mt-0.5">
        {startTime}–{endTime}
      </span>

      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-black/10"
          aria-label="Eliminar de la agenda"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
