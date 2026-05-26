import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/json-ld";

/**
 * Robots.txt generado por Next.js.
 * Se permite el rastreo completo a todos los crawlers, incluyendo los de IA.
 * Referencia crawlers IA: https://darkvisitors.com
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Buscadores tradicionales
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Bingbot", allow: "/" },
      // Crawlers de IA generativa — acceso completo al contenido público
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
      { userAgent: "YouBot", allow: "/" },
      { userAgent: "cohere-ai", allow: "/" },
      // Regla general: permitir todo lo demás
      { userAgent: "*", allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
