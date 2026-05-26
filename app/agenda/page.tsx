import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, ArrowRight, Clock3 } from "lucide-react";
import WeeklyPlanner from "@/components/agenda/WeeklyPlanner";
import { mockAgendaItems, getActivityById, getCategoryById, categories } from "@/lib/mock-data";
import { SITE_URL } from "@/lib/json-ld";

export const metadata: Metadata = {
  title: "Mi agenda semanal",
  description:
    "Organiza tus actividades semanales con el planificador de Despeja tu mente. Visualiza tu semana y mantén un equilibrio saludable: máximo 2 actividades por día.",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: `${SITE_URL}/agenda`,
    title: "Mi agenda semanal — Despeja tu mente",
    description:
      "Planificador semanal de actividades para jóvenes. Organiza tu semana y desconecta de las pantallas.",
  },
  keywords: ["agenda actividades Barcelona", "planificador semanal jóvenes", "organizar actividades"],
};

function AgendaSummary() {
  const total = mockAgendaItems.length;
  const totalMinutes = mockAgendaItems.reduce((acc, item) => {
    const act = getActivityById(item.activityId);
    return acc + (act?.durationMin ?? 0);
  }, 0);
  const totalHours = Math.round(totalMinutes / 60);

  const usedCategoryIds = [
    ...new Set(
      mockAgendaItems
        .map((item) => getActivityById(item.activityId)?.categoryId)
        .filter(Boolean) as string[]
    ),
  ];
  const usedCategories = categories.filter((c) => usedCategoryIds.includes(c.id));

  const isBalanced = usedCategoryIds.length >= 3;

  return (
    <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
      <h2 className="font-display font-bold text-base text-ink">Resumen semanal</h2>

      <div className="flex gap-4">
        <div className="flex-1 bg-sand rounded-xl p-3 text-center">
          <p className="text-2xl font-display font-extrabold text-ink">{total}</p>
          <p className="text-xs text-ink-light mt-0.5">actividades</p>
        </div>
        <div className="flex-1 bg-sand rounded-xl p-3 text-center">
          <p className="text-2xl font-display font-extrabold text-ink">{totalHours}h</p>
          <p className="text-xs text-ink-light mt-0.5">de actividad</p>
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-ink-light mb-2">Categorías</p>
        <div className="flex flex-wrap gap-1.5">
          {usedCategories.map((cat) => (
            <span
              key={cat.id}
              className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ backgroundColor: cat.bgColor, color: cat.textColor }}
            >
              {cat.name}
            </span>
          ))}
        </div>
      </div>

      {isBalanced && (
        <div className="flex items-start gap-2 bg-green/5 border border-green/20 rounded-xl p-3" style={{ backgroundColor: "#f0fdf4", borderColor: "#86efac" }}>
          <span className="text-lg">🌟</span>
          <p className="text-xs text-green-700" style={{ color: "#15803d" }}>
            ¡Semana equilibrada! Tienes variedad de actividades y tiempo para descansar.
          </p>
        </div>
      )}

      <Link
        href="/actividades"
        className="flex items-center justify-center gap-2 w-full text-sm font-medium bg-primary text-white py-2.5 rounded-full hover:bg-primary-dark transition-colors"
      >
        Explorar más actividades
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

export default function AgendaPage() {
  return (
    <div className="pt-16 min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-sand border-b border-border">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CalendarDays className="w-5 h-5 text-primary" />
                <h1 className="font-display font-extrabold text-3xl text-ink">
                  Mi Agenda
                </h1>
              </div>
              <p className="text-ink-light">
                Hola, <span className="font-semibold text-ink">Carlos</span> · 19 años
              </p>
            </div>
            <Link
              href="/actividades"
              className="inline-flex items-center gap-2 bg-primary text-white font-medium px-5 py-2.5 rounded-full hover:bg-primary-dark transition-colors text-sm self-start sm:self-auto"
            >
              <span>+ Explorar actividades</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Planner */}
          <div className="flex-1 min-w-0">
            <WeeklyPlanner />
          </div>

          {/* Summary sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <AgendaSummary />

            {/* Legend */}
            <div className="mt-4 bg-card border border-border rounded-2xl p-4 space-y-2">
              <p className="text-xs font-semibold text-ink-light uppercase tracking-wide mb-3">
                Leyenda
              </p>
              <div className="flex items-center gap-2 text-xs text-ink-light">
                <div className="w-4 h-4 rounded border-2 border-dashed border-ink-light" />
                Planificada
              </div>
              <div className="flex items-center gap-2 text-xs text-ink-light">
                <div className="w-4 h-4 rounded border-2 border-primary bg-primary/10" />
                Confirmada
              </div>
              <div className="mt-3 pt-3 border-t border-border space-y-1.5">
                <p className="text-xs font-semibold text-ink-light uppercase tracking-wide mb-2">
                  Carga diaria
                </p>
                {[
                  { color: "#E8E4DC", label: "Sin actividades" },
                  { color: "#22C55E", label: "1 actividad — ideal" },
                  { color: "#F59E0B", label: "2 actividades — bien" },
                  { color: "#EF4444", label: "3+ — demasiado" },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-2 text-xs text-ink-light">
                    <div className="w-4 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
