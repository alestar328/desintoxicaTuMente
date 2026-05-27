"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ArrowRight, ArrowLeft, Building2, MapPin, Camera, Sparkles, Loader2 } from "lucide-react";
import ImageUpload from "@/components/provider/ImageUpload";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/client";
import { createProvider, uploadProviderAvatar } from "@/lib/supabase/queries";

interface RegistroData {
  businessName: string;
  description: string;
  website: string;
  address: string;
  neighborhood: string;
  city: string;
  avatar: string[];
}

const steps = [
  { id: 1, label: "Tu negocio", icon: Building2 },
  { id: 2, label: "Ubicación", icon: MapPin },
  { id: 3, label: "Foto de perfil", icon: Camera },
  { id: 4, label: "¡Listo!", icon: Sparkles },
];

const inputClass =
  "w-full border border-border rounded-xl px-3.5 py-2.5 text-sm text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-ink-light/50";

export default function ProveedorRegistroPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RegistroData>({
    businessName: "",
    description: "",
    website: "",
    address: "",
    neighborhood: "",
    city: "Barcelona",
    avatar: [],
  });

  function set<K extends keyof RegistroData>(key: K, val: RegistroData[K]) {
    setData((prev) => ({ ...prev, [key]: val }));
  }

  function canAdvance() {
    if (currentStep === 1) return data.businessName.trim() && data.description.trim();
    if (currentStep === 2) return data.address.trim() && data.city.trim();
    return true;
  }

  function handleNext() {
    if (currentStep < 4) setCurrentStep((s) => s + 1);
  }

  function handleBack() {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  }

  async function handleFinish() {
    console.log("[handleFinish] called — user:", user, "isSaving:", isSaving, "isLoading:", isLoading);

    if (isSaving) {
      console.log("[handleFinish] aborted: already saving");
      return;
    }

    if (!user) {
      console.error("[handleFinish] aborted: user is null — auth context not ready or session lost");
      setError("Sesión no encontrada. Por favor, vuelve a iniciar sesión.");
      return;
    }

    setIsSaving(true);
    setError(null);

    const supabase = createClient();

    // Subir avatar si el usuario eligió uno
    let avatarUrl: string | null = null;
    if (data.avatar[0]?.startsWith("data:")) {
      console.log("[handleFinish] uploading avatar for user:", user.id);
      const res = await fetch(data.avatar[0]);
      const blob = await res.blob();
      const file = new File([blob], "avatar.jpg", { type: blob.type });
      avatarUrl = await uploadProviderAvatar(supabase, user.id, file);
      console.log("[handleFinish] avatar upload result:", avatarUrl);
    } else {
      console.log("[handleFinish] no avatar to upload");
    }

    console.log("[handleFinish] calling createProvider with:", {
      user_id: user.id,
      name: data.businessName,
      city: data.city,
    });

    const { error: createError } = await createProvider(supabase, {
      user_id: user.id,
      name: data.businessName,
      description: data.description,
      bio: null,
      website: data.website || null,
      location: data.address || null,
      neighborhood: data.neighborhood || null,
      city: data.city,
      country: "España",
      avatar_url: avatarUrl,
      cover_image_url: null,
      is_active: true,
    });

    console.log("[handleFinish] createProvider result — error:", createError);

    if (createError) {
      console.error("[handleFinish] createProvider error details:", JSON.stringify(createError));
      setError(`No se pudo crear el perfil: ${createError.message ?? "error desconocido"}`);
      setIsSaving(false);
      return;
    }

    console.log("[handleFinish] success, redirecting to /proveedor/dashboard");
    router.push("/proveedor/dashboard");
  }

  return (
    <div className="min-h-screen pt-16 bg-sand">
      <div className="max-w-xl mx-auto px-4 py-10">

        {/* Stepper */}
        <div className="flex items-center justify-between mb-10 relative">
          <div className="absolute left-0 right-0 top-5 h-0.5 bg-border -z-0" aria-hidden />
          {steps.map((step) => {
            const done = step.id < currentStep;
            const active = step.id === currentStep;
            const StepIcon = step.icon;
            return (
              <div key={step.id} className="flex flex-col items-center gap-1.5 z-10">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                    ${done ? "bg-primary border-primary" : active ? "bg-white border-primary shadow-md shadow-primary/20" : "bg-white border-border"}
                  `}
                >
                  {done ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <StepIcon className={`w-4 h-4 ${active ? "text-primary" : "text-ink-light"}`} />
                  )}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${active ? "text-primary" : "text-ink-light"}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Contenido del paso */}
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">

          {/* Paso 1: Tu negocio */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-display font-bold text-xl text-ink mb-1">Cuéntanos sobre tu negocio</h2>
                <p className="text-sm text-ink-light">Esta información aparecerá en tu perfil público.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="businessName">
                  Nombre del negocio *
                </label>
                <input
                  id="businessName"
                  type="text"
                  required
                  value={data.businessName}
                  onChange={(e) => set("businessName", e.target.value)}
                  placeholder="Ej: Mi Academia de Surf"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="description">
                  Descripción *
                </label>
                <textarea
                  id="description"
                  required
                  rows={4}
                  value={data.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="¿Qué ofreces? ¿Cuál es vuestra filosofía? ¿Qué os hace especiales? (2-3 frases)"
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="website">
                  Página web <span className="text-ink-light font-normal">(opcional)</span>
                </label>
                <input
                  id="website"
                  type="url"
                  value={data.website}
                  onChange={(e) => set("website", e.target.value)}
                  placeholder="https://minegocio.com"
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {/* Paso 2: Ubicación */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-display font-bold text-xl text-ink mb-1">¿Dónde estáis?</h2>
                <p className="text-sm text-ink-light">Los jóvenes pueden filtrar actividades por zona.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="address">
                  Dirección *
                </label>
                <input
                  id="address"
                  type="text"
                  required
                  value={data.address}
                  onChange={(e) => set("address", e.target.value)}
                  placeholder="Ej: Carrer de Pallars, 193"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="neighborhood">
                    Barrio
                  </label>
                  <input
                    id="neighborhood"
                    type="text"
                    value={data.neighborhood}
                    onChange={(e) => set("neighborhood", e.target.value)}
                    placeholder="Ej: Poblenou"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="city">
                    Ciudad *
                  </label>
                  <input
                    id="city"
                    type="text"
                    required
                    value={data.city}
                    onChange={(e) => set("city", e.target.value)}
                    placeholder="Barcelona"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Paso 3: Foto de perfil */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-display font-bold text-xl text-ink mb-1">Pon cara a tu negocio</h2>
                <p className="text-sm text-ink-light">
                  Una foto de perfil genera más confianza. Puedes subir el logo o una foto del espacio.
                </p>
              </div>

              <ImageUpload
                label="Logo o foto de perfil"
                hint="Cuadrada o rectangular. Mín. 400×400 px. JPG o PNG."
                maxFiles={1}
                aspectRatio="square"
                value={data.avatar}
                onChange={(imgs) => set("avatar", imgs)}
              />

              <p className="text-xs text-ink-light text-center">
                También puedes saltarte este paso y añadirlo más adelante desde tu perfil.
              </p>
            </div>
          )}

          {/* Paso 4: ¡Listo! */}
          {currentStep === 4 && (
            <div className="text-center space-y-5 py-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="font-display font-bold text-xl text-ink mb-2">
                  ¡Perfil creado, {data.businessName}!
                </h2>
                <p className="text-sm text-ink-light max-w-sm mx-auto">
                  Ya tienes tu cuenta de proveedor lista. Ahora puedes publicar tu primera actividad desde el panel de gestión.
                </p>
              </div>

              <div className="bg-sand rounded-xl p-4 text-left space-y-2 text-sm">
                <p><span className="font-medium text-ink">Negocio:</span> <span className="text-ink-light">{data.businessName}</span></p>
                {data.city && <p><span className="font-medium text-ink">Ciudad:</span> <span className="text-ink-light">{data.city}{data.neighborhood ? `, ${data.neighborhood}` : ""}</span></p>}
                {data.website && <p><span className="font-medium text-ink">Web:</span> <span className="text-ink-light">{data.website}</span></p>}
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  {error}
                </p>
              )}

              <button
                onClick={handleFinish}
                disabled={isSaving || isLoading}
                className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold px-6 py-3.5 rounded-full hover:bg-primary-dark transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                {(isSaving || isLoading) && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSaving ? "Creando perfil…" : isLoading ? "Verificando sesión…" : "Ir a mi panel de gestión"}
                {!isSaving && !isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>

        {/* Navegación de pasos */}
        {currentStep < 4 && (
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center gap-2 text-sm font-medium text-ink-light hover:text-ink transition-colors disabled:opacity-0 focus:outline-none"
            >
              <ArrowLeft className="w-4 h-4" />
              Atrás
            </button>

            <button
              onClick={handleNext}
              disabled={!canAdvance()}
              className="flex items-center gap-2 bg-primary text-white font-semibold px-6 py-2.5 rounded-full hover:bg-primary-dark transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              {currentStep === 3 ? "Finalizar" : "Siguiente"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
