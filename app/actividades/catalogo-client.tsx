"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { SlidersHorizontal, X, Globe } from "lucide-react";
import {
  categories,
  type Activity,
} from "@/lib/mock-data";
import ActivityCard from "@/components/activities/ActivityCard";
import EmptyState from "@/components/common/EmptyState";
import {
  TreePine,
  Waves,
  Palette,
  Users,
  GraduationCap,
  Dumbbell,
} from "lucide-react";

const categoryIcons: Record<string, React.ElementType> = {
  exterior: TreePine,
  playa: Waves,
  artistica: Palette,
  social: Users,
  aprendizaje: GraduationCap,
  deporte: Dumbbell,
};

const WEEKDAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

interface Props {
  initialActivities: Activity[];
}

function CatalogoContent({ activities }: { activities: Activity[] }) {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("categoria") ?? "";

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCat ? [initialCat] : []
  );
  const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">("all");
  const [durationFilter, setDurationFilter] = useState<"all" | "short" | "mid" | "long">("all");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const allCities = useMemo(
    () =>
      Array.from(
        new Map(activities.map((a) => [a.city, { city: a.city, country: a.country }])).values()
      ),
    [activities]
  );

  const filtered = useMemo(() => {
    return activities.filter((a: Activity) => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(a.categoryId)) return false;
      if (priceFilter === "free" && a.priceType !== "free") return false;
      if (priceFilter === "paid" && a.priceType !== "paid") return false;
      if (durationFilter === "short" && a.durationMin >= 60) return false;
      if (durationFilter === "mid" && (a.durationMin < 60 || a.durationMin > 120)) return false;
      if (durationFilter === "long" && a.durationMin <= 120) return false;
      if (selectedDays.length > 0) {
        const actDays = a.schedules.map((s) => s.weekday);
        if (!selectedDays.some((d) => actDays.includes(d))) return false;
      }
      if (selectedCities.length > 0 && !selectedCities.includes(a.city)) return false;
      return true;
    });
  }, [activities, selectedCategories, priceFilter, durationFilter, selectedDays, selectedCities]);

  function toggleCategory(id: string) {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  function toggleDay(day: string) {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }

  function toggleCity(city: string) {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  }

  function clearFilters() {
    setSelectedCategories([]);
    setPriceFilter("all");
    setDurationFilter("all");
    setSelectedDays([]);
    setSelectedCities([]);
  }

  const activeFilterCount =
    selectedCategories.length +
    (priceFilter !== "all" ? 1 : 0) +
    (durationFilter !== "all" ? 1 : 0) +
    selectedDays.length +
    selectedCities.length;

  const Sidebar = () => (
    <div className="space-y-6">
      {/* Ciudad */}
      <div>
        <p className="text-sm font-semibold text-ink mb-3">Ciudad</p>
        <div className="space-y-2">
          {allCities.map(({ city, country }) => {
            const checked = selectedCities.includes(city);
            return (
              <label key={city} className="flex items-center gap-2.5 cursor-pointer group">
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                    checked ? "bg-primary border-transparent" : "border-border"
                  }`}
                  onClick={() => toggleCity(city)}
                >
                  {checked && <span className="text-white text-[10px] font-bold">✓</span>}
                </div>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={() => toggleCity(city)}
                />
                <Globe className="w-4 h-4 shrink-0 text-ink-light" />
                <span className="text-sm text-ink group-hover:text-primary transition-colors">
                  {city}
                  <span className="text-ink-light ml-1 text-xs">{country}</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Categorías */}
      <div>
        <p className="text-sm font-semibold text-ink mb-3">Categoría</p>
        <div className="space-y-2">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.slug] ?? Waves;
            const checked = selectedCategories.includes(cat.id);
            return (
              <label
                key={cat.id}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                    checked ? "border-transparent" : "border-border"
                  }`}
                  style={checked ? { backgroundColor: cat.color } : {}}
                  onClick={() => toggleCategory(cat.id)}
                >
                  {checked && <span className="text-white text-[10px] font-bold">✓</span>}
                </div>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={() => toggleCategory(cat.id)}
                />
                <Icon className="w-4 h-4 shrink-0" style={{ color: cat.color }} />
                <span className="text-sm text-ink group-hover:text-primary transition-colors">
                  {cat.name}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Precio */}
      <div>
        <p className="text-sm font-semibold text-ink mb-3">Precio</p>
        <div className="space-y-2">
          {(["all", "free", "paid"] as const).map((opt) => (
            <label key={opt} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="radio"
                name="price"
                value={opt}
                checked={priceFilter === opt}
                onChange={() => setPriceFilter(opt)}
                className="accent-primary w-4 h-4"
              />
              <span className="text-sm text-ink">
                {opt === "all" ? "Todos" : opt === "free" ? "Gratis" : "De pago"}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Duración */}
      <div>
        <p className="text-sm font-semibold text-ink mb-3">Duración</p>
        <div className="space-y-2">
          {(
            [
              ["all", "Cualquiera"],
              ["short", "Menos de 1h"],
              ["mid", "1 – 2 horas"],
              ["long", "Más de 2h"],
            ] as const
          ).map(([val, label]) => (
            <label key={val} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="radio"
                name="duration"
                value={val}
                checked={durationFilter === val}
                onChange={() => setDurationFilter(val)}
                className="accent-primary w-4 h-4"
              />
              <span className="text-sm text-ink">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Día de la semana */}
      <div>
        <p className="text-sm font-semibold text-ink mb-3">Día disponible</p>
        <div className="flex flex-wrap gap-1.5">
          {WEEKDAYS.map((day) => {
            const active = selectedDays.includes(day);
            return (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`text-xs px-2.5 py-1.5 rounded-full border transition-colors ${
                  active
                    ? "bg-primary text-white border-primary"
                    : "border-border text-ink-light hover:border-primary hover:text-primary"
                }`}
              >
                {day.substring(0, 3)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Clear */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="w-full text-sm font-medium text-ink-light border border-border rounded-full py-2 hover:bg-sand transition-colors"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );

  return (
    <div className="pt-16 min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-sand border-b border-border py-10">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-ink mb-2">
            Actividades en Barcelona
          </h1>
          <p className="text-ink-light">
            {filtered.length} actividad{filtered.length !== 1 ? "es" : ""} disponible
            {filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile filter toggle */}
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="md:hidden flex items-center gap-2 text-sm font-medium border border-border rounded-full px-4 py-2 mb-4 bg-card hover:bg-sand transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtros {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>

        {/* Active filter pills */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedCities.map((city) => (
              <span
                key={city}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-sand border border-border text-ink"
              >
                <Globe className="w-3 h-3" />
                {city}
                <button onClick={() => toggleCity(city)} aria-label="Quitar filtro ciudad">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {selectedCategories.map((catId) => {
              const cat = categories.find((c) => c.id === catId);
              if (!cat) return null;
              return (
                <span
                  key={catId}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: cat.bgColor, color: cat.textColor }}
                >
                  {cat.name}
                  <button onClick={() => toggleCategory(catId)} aria-label="Quitar filtro">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
            {priceFilter !== "all" && (
              <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-sand border border-border text-ink">
                {priceFilter === "free" ? "Gratis" : "De pago"}
                <button onClick={() => setPriceFilter("all")} aria-label="Quitar filtro">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {durationFilter !== "all" && (
              <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-sand border border-border text-ink">
                {durationFilter === "short" ? "< 1h" : durationFilter === "mid" ? "1–2h" : "> 2h"}
                <button onClick={() => setDurationFilter("all")} aria-label="Quitar filtro">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedDays.map((day) => (
              <span
                key={day}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
                style={{ backgroundColor: "#e0f2fe", color: "#0369a1" }}
              >
                {day}
                <button onClick={() => toggleDay(day)} aria-label="Quitar filtro">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-8">
          {/* Sidebar desktop */}
          <aside className="hidden md:block w-56 shrink-0">
            <div className="sticky top-24 bg-card border border-border rounded-2xl p-5">
              <Sidebar />
            </div>
          </aside>

          {/* Mobile sidebar */}
          {filtersOpen && (
            <div className="md:hidden fixed inset-0 z-40">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setFiltersOpen(false)}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-display font-bold text-lg text-ink">Filtros</h2>
                  <button onClick={() => setFiltersOpen(false)}>
                    <X className="w-5 h-5 text-ink-light" />
                  </button>
                </div>
                <Sidebar />
              </div>
            </div>
          )}

          {/* Grid */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <EmptyState
                title="Sin resultados"
                description="Prueba a cambiar o limpiar los filtros para ver más actividades."
                actionLabel="Limpiar filtros"
                icon="🔍"
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((activity, i) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    animationDelay={i * 60}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CatalogoClient({ initialActivities }: Props) {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-ink-light">Cargando...</div>}>
      <CatalogoContent activities={initialActivities} />
    </Suspense>
  );
}
