"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, ExternalLink } from "lucide-react";
import StarRating from "@/components/provider/StarRating";
import ImageUpload from "@/components/provider/ImageUpload";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/client";
import { getProviderByUserId, updateProviderData, uploadProviderAvatar } from "@/lib/supabase/queries";
import type { Provider } from "@/lib/mock-data";

const inputClass =
  "w-full border border-border rounded-xl px-3.5 py-2.5 text-sm text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-ink-light/50";

export default function ProveedorPerfilPage() {
  const { user } = useAuth();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    bio: "",
    website: "",
    location: "",
    city: "",
    avatar: [] as string[],
  });

  function set<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  // Cargar datos del proveedor al montar
  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    getProviderByUserId(supabase, user.id).then((p) => {
      if (p) {
        setProvider(p);
        setForm({
          name: p.name,
          description: p.description,
          bio: p.bio ?? "",
          website: p.website ?? "",
          location: p.location ?? "",
          city: p.city,
          avatar: p.avatarPath ? [p.avatarPath] : [],
        });
      }
      setIsLoading(false);
    });
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!provider) return;
    setIsSaving(true);

    const supabase = createClient();

    // Subir avatar nuevo si es un data: URL (imagen recién seleccionada)
    let avatarUrl: string | undefined = undefined;
    if (form.avatar[0]?.startsWith("data:") && user) {
      const res = await fetch(form.avatar[0]);
      const blob = await res.blob();
      const file = new File([blob], "avatar.jpg", { type: blob.type });
      const uploaded = await uploadProviderAvatar(supabase, user.id, file);
      if (uploaded) avatarUrl = uploaded;
    } else if (form.avatar[0]?.startsWith("http")) {
      avatarUrl = form.avatar[0];
    }

    await updateProviderData(supabase, provider.id, {
      name: form.name,
      description: form.description,
      bio: form.bio || null,
      website: form.website || null,
      location: form.location || null,
      city: form.city,
      ...(avatarUrl !== undefined ? { avatar_url: avatarUrl } : {}),
    });

    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-ink-light" />
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-surface">
      {/* Sub-nav */}
      <div className="border-b border-border bg-white sticky top-16 z-30">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 h-12">
            <Link href="/proveedor/dashboard" className="text-sm font-medium text-ink-light hover:text-ink transition-colors shrink-0">
              Panel
            </Link>
            <Link href="/proveedor/actividades/nueva" className="text-sm font-medium text-ink-light hover:text-ink transition-colors shrink-0">
              Nueva actividad
            </Link>
            <Link href="/proveedor/perfil" className="text-sm font-medium text-primary border-b-2 border-primary pb-0.5 shrink-0">
              Mi perfil
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/proveedor/dashboard" className="text-ink-light hover:text-ink transition-colors focus:outline-none">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-display font-bold text-2xl text-ink">Mi perfil de proveedor</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Avatar */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="font-display font-semibold text-base text-ink">Imagen de perfil</h2>
            <div className="flex items-start gap-5">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden border border-border">
                {form.avatar[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.avatar[0]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-display font-bold text-3xl text-primary">
                    {form.name.charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <ImageUpload
                  label="Subir logo o foto"
                  hint="Cuadrada, mín. 200×200 px. JPG o PNG."
                  maxFiles={1}
                  aspectRatio="square"
                  value={form.avatar}
                  onChange={(imgs) => set("avatar", imgs)}
                />
              </div>
            </div>
          </div>

          {/* Datos básicos */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <h2 className="font-display font-semibold text-base text-ink">Información del negocio</h2>

            <div>
              <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="prov-name">
                Nombre del negocio *
              </label>
              <input
                id="prov-name"
                type="text"
                required
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="prov-desc">
                Descripción breve *
              </label>
              <textarea
                id="prov-desc"
                required
                rows={2}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Una frase que resume tu oferta"
                className={`${inputClass} resize-none`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="prov-bio">
                Bio <span className="text-ink-light font-normal">(opcional)</span>
              </label>
              <textarea
                id="prov-bio"
                rows={4}
                value={form.bio}
                onChange={(e) => set("bio", e.target.value)}
                placeholder="Historia del negocio, equipo, filosofía, certificaciones…"
                className={`${inputClass} resize-none`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="prov-web">
                Página web
              </label>
              <div className="relative">
                <input
                  id="prov-web"
                  type="url"
                  value={form.website}
                  onChange={(e) => set("website", e.target.value)}
                  placeholder="https://tudominio.com"
                  className={`${inputClass} pr-10`}
                />
                {form.website && (
                  <a
                    href={form.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-light hover:text-primary"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <h2 className="font-display font-semibold text-base text-ink">Ubicación</h2>

            <div>
              <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="prov-location">
                Dirección
              </label>
              <input
                id="prov-location"
                type="text"
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                placeholder="Carrer de…"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="prov-city">
                Ciudad *
              </label>
              <input
                id="prov-city"
                type="text"
                required
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Valoraciones — solo lectura */}
          {provider && (
            <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
              <h2 className="font-display font-semibold text-base text-ink">Valoraciones</h2>
              <StarRating rating={provider.rating} reviewCount={provider.reviewCount} size="lg" />
              <p className="text-xs text-ink-light">
                Las valoraciones las dejan los participantes después de asistir a una actividad.{" "}
                <span className="text-primary">Próximamente podrás ver los comentarios completos.</span>
              </p>
            </div>
          )}

          {/* Guardar */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-full hover:bg-primary-dark transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? "Guardando…" : "Guardar cambios"}
            </button>
            {saved && <span className="text-sm text-green-600 font-medium">¡Cambios guardados!</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
