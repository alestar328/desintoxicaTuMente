import type { MetadataRoute } from "next";
import { activities } from "@/lib/mock-data";
import { SITE_URL } from "@/lib/json-ld";

/**
 * Sitemap dinámico generado por Next.js.
 * Las entradas de actividades se generan automáticamente desde mock-data
 * — cuando se integre Supabase, reemplazar `activities` por una query a la BD.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/actividades`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/proveedores`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/agenda`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];

  // Una entrada por actividad — priority alta porque son las páginas de destino SEO
  const activityRoutes: MetadataRoute.Sitemap = activities.map((activity) => ({
    url: `${SITE_URL}/actividades/${activity.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...activityRoutes];
}
