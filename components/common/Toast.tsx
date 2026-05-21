"use client";

import { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, visible, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (visible) {
      const t = setTimeout(onClose, duration);
      return () => clearTimeout(t);
    }
  }, [visible, onClose, duration]);

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-ink text-white px-5 py-3 rounded-xl shadow-xl transition-all duration-300",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      <CheckCircle2 className="w-5 h-5 text-green shrink-0" style={{ color: "#22C55E" }} />
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-1 text-white/60 hover:text-white transition-colors"
        aria-label="Cerrar notificación"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
