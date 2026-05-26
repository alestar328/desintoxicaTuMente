import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Route Handler — callback de Google OAuth.
 * Supabase redirige aquí tras la autenticación con Google con un `code` en la URL.
 * Intercambia el code por la sesión y decide a dónde redirigir según el estado del perfil.
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/login?error=no_code`);
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    console.error("OAuth code exchange failed:", exchangeError.message);
    return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`);
  }

  // Obtener el usuario recién autenticado
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(`${origin}/auth/login?error=no_user`);
  }

  // Comprobar si el perfil ya tiene account_type (usuario que vuelve)
  const { data: profile } = await supabase
    .from("profiles")
    .select("account_type")
    .eq("id", user.id)
    .single();

  if (!profile?.account_type) {
    // Nuevo usuario: elegir tipo de cuenta
    return NextResponse.redirect(`${origin}/auth/tipo-cuenta`);
  }

  if (profile.account_type === "proveedor") {
    // Comprobar si ya tiene registro de proveedor
    const { data: provider } = await supabase
      .from("providers")
      .select("id")
      .eq("user_id", user.id)
      .single();

    return NextResponse.redirect(
      provider ? `${origin}/proveedor/dashboard` : `${origin}/proveedor/registro`
    );
  }

  // Explorer o beneficiary → home
  return NextResponse.redirect(`${origin}/`);
}
