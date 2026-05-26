"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Waves } from "lucide-react";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import { useAuth } from "@/lib/auth-context";

function LoginContent() {
  const { signInWithGoogle, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const isProviderFlow = searchParams.get("tipo") === "proveedor";
  const hasError = !!searchParams.get("error");

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-sand px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <Waves className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-ink text-center">
            {isProviderFlow ? "Publica tu actividad" : "Empieza a explorar"}
          </h1>
          <p className="text-sm text-ink-light text-center mt-1.5 max-w-xs">
            {isProviderFlow
              ? "Accede con Google para gestionar tus actividades."
              : "Guarda actividades, arma tu agenda y desconecta de las pantallas."}
          </p>
        </div>

        {/* Error de OAuth */}
        {hasError && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 text-center">
            Algo fue mal al iniciar sesión. Inténtalo de nuevo.
          </div>
        )}

        {/* Login card */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
          <GoogleSignInButton onClick={signInWithGoogle} isLoading={isLoading} />

          <p className="text-xs text-ink-light text-center">
            Al continuar aceptas los{" "}
            <Link href="#" className="underline hover:text-ink">Términos de uso</Link>{" "}
            y la{" "}
            <Link href="#" className="underline hover:text-ink">Política de privacidad</Link>.
          </p>
        </div>

        <div className="text-center mt-6">
          {isProviderFlow ? (
            <p className="text-sm text-ink-light">
              ¿Quieres explorar actividades?{" "}
              <Link href="/auth/login" className="text-primary font-medium hover:underline">
                Accede aquí
              </Link>
            </p>
          ) : (
            <p className="text-sm text-ink-light">
              ¿Eres proveedor?{" "}
              <Link href="/auth/login?tipo=proveedor" className="text-primary font-medium hover:underline">
                Publica tus actividades
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-16 bg-sand" />}>
      <LoginContent />
    </Suspense>
  );
}
