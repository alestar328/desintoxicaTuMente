"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Activity, Category } from "@/lib/mock-data";

interface Props {
  activities: Activity[];
  categories: Category[];
}

export default function ActivityCarousel({ activities, categories }: Props) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number>(0);
  const didSwipe = useRef<boolean>(false);

  const advance = useCallback(() => {
    setCurrent((c) => (c + 1) % activities.length);
  }, [activities.length]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(advance, 3500);
    return () => clearInterval(timer);
  }, [advance, paused]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    didSwipe.current = false;
    setPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      didSwipe.current = true;
      setCurrent((c) =>
        delta < 0
          ? (c + 1) % activities.length
          : (c - 1 + activities.length) % activities.length
      );
    }
    setPaused(false);
  };

  return (
    <div
      className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {activities.map((act, i) => {
        const cat = categories.find((c) => c.id === act.categoryId);
        return (
          <Link
            key={act.id}
            href={`/actividades/${act.id}`}
            onClick={(e) => { if (didSwipe.current) e.preventDefault(); }}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === current ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <Image
              src={act.imagePath}
              alt={act.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority={i === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center gap-2 mb-2">
                {cat && (
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
                    style={{ backgroundColor: cat.color }}
                  >
                    {cat.name}
                  </span>
                )}
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">
                  {act.priceLabel}
                </span>
              </div>
              <p className="text-white font-semibold text-sm leading-snug drop-shadow">
                {act.title}
              </p>
              <p className="text-white/70 text-xs mt-0.5">{act.neighborhood} · {act.city}</p>
            </div>
          </Link>
        );
      })}

      {/* Progress dots */}
      <div className="absolute bottom-3 right-4 flex items-center gap-1.5 z-10">
        {activities.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? "w-5 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Ir a actividad ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
