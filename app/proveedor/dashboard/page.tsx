import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Settings, Eye, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getProviderByUserId, getProviderActivities } from "@/lib/supabase/queries";
import ProviderActivityCard from "@/components/provider/ProviderActivityCard";
import StarRating from "@/components/provider/StarRating";

export default async function ProveedorDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?tipo=proveedor");

  const provider = await getProviderByUserId(supabase, user.id);
  if (!provider) redirect("/proveedor/registro");

  const activities = await getProviderActivities(supabase, provider.id);
  const publishedCount = activities.filter((a) => a.isPublished).length;

  return (
    <div className="pt-16 min-h-screen bg-surface">
      {/* Sub-nav del área de proveedor */}
      <div className="border-b border-border bg-white sticky top-16 z-30">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 h-12 overflow-x-auto">
            <Link href="/proveedor/dashboard" className="text-sm font-medium text-primary border-b-2 border-primary pb-0.5 shrink-0">
              Panel
            </Link>
            <Link href="/proveedor/actividades/nueva" className="text-sm font-medium text-ink-light hover:text-ink transition-colors shrink-0">
              Nueva actividad
            </Link>
            <Link href="/proveedor/perfil" className="text-sm font-medium text-ink-light hover:text-ink transition-colors shrink-0">
              Mi perfil
            </Link>
            <Link href={`/actividades?proveedor=${provider.id}`} className="text-sm font-medium text-ink-light hover:text-ink transition-colors shrink-0 ml-auto flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              Vista pública
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

        {/* Header del proveedor */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden border border-border">
              {provider.avatarPath ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={provider.avatarPath} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="font-display font-bold text-2xl text-primary">
                  {provider.name.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-ink">{provider.name}</h1>
              <StarRating rating={provider.rating} reviewCount={provider.reviewCount} size="sm" />
            </div>
          </div>

          <Link
            href="/proveedor/perfil"
            className="flex items-center gap-2 text-sm font-medium text-ink-light border border-border rounded-full px-4 py-2 hover:bg-sand hover:border-ink/20 transition-colors focus:outline-none"
          >
            <Settings className="w-4 h-4" />
            Editar perfil
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-2xl p-5">
            <p className="text-2xl font-display font-bold text-ink">{publishedCount}</p>
            <p className="text-sm text-ink-light mt-1">{publishedCount === 1 ? "Actividad publicada" : "Actividades publicadas"}</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-1.5 mb-1">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span className="text-2xl font-display font-bold text-ink">{provider.rating.toFixed(1)}</span>
            </div>
            <p className="text-sm text-ink-light">{provider.reviewCount} valoraciones</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5 col-span-2 sm:col-span-1">
            <p className="text-2xl font-display font-bold text-ink">Beta</p>
            <p className="text-sm text-ink-light mt-1">0 comisión — fase beta</p>
          </div>
        </div>

        {/* Actividades */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-lg text-ink">Mis actividades</h2>
            <Link
              href="/proveedor/actividades/nueva"
              className="flex items-center gap-2 bg-primary text-white font-semibold px-4 py-2 rounded-full hover:bg-primary-dark transition-colors duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <Plus className="w-4 h-4" />
              Nueva actividad
            </Link>
          </div>

          {activities.length === 0 ? (
            <div className="bg-card border border-border border-dashed rounded-2xl py-16 text-center">
              <p className="text-ink-light text-sm mb-4">Aún no tienes actividades publicadas.</p>
              <Link
                href="/proveedor/actividades/nueva"
                className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-5 py-2.5 rounded-full hover:bg-primary-dark transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Añade tu primera actividad
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activities.map((activity) => (
                <ProviderActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          )}
        </div>

        {/* Banner: añadir más actividades */}
        {activities.length > 0 && (
          <div className="bg-ink rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <div>
              <p className="font-display font-semibold text-white text-base">¿Tienes más actividades?</p>
              <p className="text-white/60 text-sm mt-0.5">Puedes publicar tantas como quieras. Sin límite, sin coste en beta.</p>
            </div>
            <Link
              href="/proveedor/actividades/nueva"
              className="shrink-0 flex items-center gap-2 bg-primary text-white font-semibold px-5 py-2.5 rounded-full hover:bg-primary-dark transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-ink"
            >
              <Plus className="w-4 h-4" />
              Añadir actividad
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
