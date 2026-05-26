"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User, ArrowRight, Calendar, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/client";
import { updateProfile } from "@/lib/supabase/queries";

function PerfilContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tipo = searchParams.get("tipo") ?? "explorer";
  const isBeneficiary = tipo === "beneficiary";
  const { user } = useAuth();

  const [form, setForm] = useState({
    myAge: "",
    beneficiaryName: "",
    beneficiaryAge: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);

    if (user) {
      const supabase = createClient();
      if (isBeneficiary) {
        // Guardar datos del beneficiario (hijo/tutorado) en profiles
        await updateProfile(supabase, user.id, {
          beneficiary_name: form.beneficiaryName,
          beneficiary_age: parseInt(form.beneficiaryAge, 10),
        });
      }
      // Para explorer: la edad propia se guardará cuando se añada la columna en DB
    }

    router.push("/");
  }

  const inputClass =
    "w-full border border-border rounded-xl px-3.5 py-2.5 text-sm text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-ink-light/50";

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-sand px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="w-7 h-7 text-primary" />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-ink mb-2">
            {isBeneficiary ? "¿Para quién es?" : "¿Cuántos años tienes?"}
          </h1>
          <p className="text-sm text-ink-light">
            {isBeneficiary
              ? "Así personalizamos las actividades para la persona a tu cargo."
              : "Filtramos las actividades según tu edad para que sean las más adecuadas."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
          {isBeneficiary ? (
            <>
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="beneficiaryName">
                  Nombre de tu hijo/a o tutorado/a *
                </label>
                <input
                  id="beneficiaryName"
                  type="text"
                  required
                  value={form.beneficiaryName}
                  onChange={(e) => setForm((p) => ({ ...p, beneficiaryName: e.target.value }))}
                  placeholder="Nombre"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="beneficiaryAge">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-ink-light" />
                    Edad *
                  </span>
                </label>
                <input
                  id="beneficiaryAge"
                  type="number"
                  required
                  min={5}
                  max={30}
                  value={form.beneficiaryAge}
                  onChange={(e) => setForm((p) => ({ ...p, beneficiaryAge: e.target.value }))}
                  placeholder="Ej: 14"
                  className={inputClass}
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="myAge">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-ink-light" />
                  Tu edad *
                </span>
              </label>
              <input
                id="myAge"
                type="number"
                required
                min={8}
                max={99}
                value={form.myAge}
                onChange={(e) => setForm((p) => ({ ...p, myAge: e.target.value }))}
                placeholder="Ej: 17"
                className={inputClass}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-full hover:bg-primary-dark transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            Empezar a explorar
            {!isSaving && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function PerfilPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-16 bg-sand" />}>
      <PerfilContent />
    </Suspense>
  );
}
