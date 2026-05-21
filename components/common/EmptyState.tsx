import Link from "next/link";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title = "Tu verano está en blanco ✦",
  description = "Añade la primera actividad y empieza a construir tu semana perfecta.",
  actionLabel = "Explorar actividades",
  actionHref = "/actividades",
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="text-6xl mb-4">{icon ?? "🌊"}</div>
      <h3 className="font-display font-bold text-xl text-ink mb-2">{title}</h3>
      <p className="text-ink-light text-sm max-w-xs mb-6">{description}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center bg-primary text-white font-medium text-sm px-5 py-2.5 rounded-full hover:bg-primary-dark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
