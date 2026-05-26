import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware de Next.js:
 * 1. Refresca el token de sesión de Supabase en cada request (para que no caduque).
 * 2. Protege las rutas de proveedor — redirige al login si no hay sesión activa.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Escribir cookies en el request (para el resto del pipeline)
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // Crear una nueva respuesta con las cookies actualizadas
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refrescar sesión (no lanza error si no hay sesión)
  const { data: { user } } = await supabase.auth.getUser();

  // Rutas de proveedor: requieren sesión activa
  if (request.nextUrl.pathname.startsWith("/proveedor") && !user) {
    return NextResponse.redirect(
      new URL("/auth/login?tipo=proveedor", request.url)
    );
  }

  return response;
}

export const config = {
  // Excluir archivos estáticos y assets de imagen para no ralentizar el serving
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|img|llms\\.txt|robots\\.txt|sitemap\\.xml).*)",
  ],
};
