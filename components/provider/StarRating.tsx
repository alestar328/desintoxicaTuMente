"use client";

interface StarRatingProps {
  rating: number;       // 0–5, acepta decimales (ej: 4.7)
  reviewCount?: number;
  size?: "sm" | "md" | "lg";
  // interactive=true: permite al usuario seleccionar una valoración (para futuras reviews)
  interactive?: boolean;
  onRate?: (stars: number) => void;
}

const sizes = {
  sm: "w-3.5 h-3.5",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

/**
 * Muestra estrellas basadas en un rating numérico.
 * En modo interactive, el usuario puede hacer clic para valorar.
 * TODO Supabase: cuando interactive=true y el usuario pulsa, llamar a
 *   supabase.from('provider_reviews').insert({ provider_id, user_id, stars, created_at })
 *   y recalcular el promedio en la tabla providers.
 */
export default function StarRating({
  rating,
  reviewCount,
  size = "md",
  interactive = false,
  onRate,
}: StarRatingProps) {
  const starClass = sizes[size];

  function renderStar(index: number) {
    const filled = rating >= index + 1;
    const half = !filled && rating >= index + 0.5;

    return (
      <button
        key={index}
        type="button"
        disabled={!interactive}
        onClick={() => interactive && onRate?.(index + 1)}
        className={interactive ? "hover:scale-110 transition-transform focus:outline-none" : "cursor-default"}
        aria-label={interactive ? `Dar ${index + 1} estrella${index > 0 ? "s" : ""}` : undefined}
      >
        <svg
          className={starClass}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {half ? (
            /* Media estrella con gradiente */
            <>
              <defs>
                <linearGradient id={`half-${index}`} x1="0" x2="1" y1="0" y2="0">
                  <stop offset="50%" stopColor="#F59E0B" />
                  <stop offset="50%" stopColor="#E8E4DC" />
                </linearGradient>
              </defs>
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill={`url(#half-${index})`}
                stroke="#F59E0B"
                strokeWidth="1"
              />
            </>
          ) : (
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={filled ? "#F59E0B" : "#E8E4DC"}
              stroke={filled ? "#F59E0B" : "#D1CBC0"}
              strokeWidth="1"
            />
          )}
        </svg>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[0, 1, 2, 3, 4].map(renderStar)}
      </div>
      {(rating > 0 || reviewCount !== undefined) && (
        <div className="flex items-center gap-1 text-sm text-ink-light">
          {rating > 0 && (
            <span className="font-semibold text-ink">{rating.toFixed(1)}</span>
          )}
          {reviewCount !== undefined && (
            <span>({reviewCount} {reviewCount === 1 ? "valoración" : "valoraciones"})</span>
          )}
        </div>
      )}
    </div>
  );
}
