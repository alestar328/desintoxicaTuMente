import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { activities, getActivityById, getCategoryById, getProviderById } from "@/lib/mock-data";
import ActivityDetailClient from "@/components/activities/ActivityDetailClient";
import { buildCourseSchema, SITE_URL } from "@/lib/json-ld";

interface Props {
  params: Promise<{ id: string }>;
}

/**
 * Pre-genera rutas estáticas para todas las actividades del catálogo.
 * Cuando se integre Supabase, sustituir por una query que devuelva todos los IDs:
 *   const { data } = await supabase.from('activities').select('id')
 *   return data.map(({ id }) => ({ id }))
 */
export function generateStaticParams() {
  return activities.map((activity) => ({ id: activity.id }));
}

/** Metadatos dinámicos por actividad — título, descripción e imagen específicos */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const activity = getActivityById(id);

  if (!activity) {
    return { title: "Actividad no encontrada" };
  }

  const provider = getProviderById(activity.providerId);
  const priceText = activity.priceType === "free" ? "Gratis" : `${activity.priceLabel}`;
  const durationText =
    activity.durationMin >= 60
      ? `${Math.floor(activity.durationMin / 60)}h${activity.durationMin % 60 > 0 ? ` ${activity.durationMin % 60}min` : ""}`
      : `${activity.durationMin}min`;

  const description = `${activity.description.slice(0, 140)}… ${priceText} · ${durationText} · ${activity.city} · ${activity.minAge}-${activity.maxAge} años.`;

  return {
    title: activity.title,
    description,
    openGraph: {
      type: "website",
      locale: "es_ES",
      url: `${SITE_URL}/actividades/${activity.id}`,
      title: `${activity.title} — Despeja tu mente`,
      description,
      images: activity.imagePath
        ? [{ url: activity.imagePath, width: 1200, height: 630, alt: activity.title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: activity.title,
      description,
      images: activity.imagePath ? [activity.imagePath] : [],
    },
    keywords: [
      activity.title,
      activity.city,
      activity.neighborhood,
      activity.categoryId,
      provider?.name ?? "",
      `actividades ${activity.city}`,
      `${activity.categoryId} ${activity.city}`,
    ].filter(Boolean),
  };
}

export default async function ActivityDetailPage({ params }: Props) {
  const { id } = await params;
  const activity = getActivityById(id);
  if (!activity) notFound();

  const category = getCategoryById(activity.categoryId);
  const provider = getProviderById(activity.providerId);

  const courseSchema = buildCourseSchema(activity, provider);

  return (
    <>
      {/* Schema Course: describe la actividad para crawlers de IA y buscadores */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <ActivityDetailClient
        activity={activity}
        category={category}
        provider={provider}
      />
    </>
  );
}
