"use client";

import { useState } from "react";
import { CheckCircle2, Eye, Zap, Gift } from "lucide-react";

const benefits = [
  {
    icon: Eye,
    title: "Visibilidad",
    desc: "Tu actividad aparece ante cientos de padres y jóvenes de Barcelona que buscan exactamente lo que ofreces.",
  },
  {
    icon: Zap,
    title: "Reservas directas",
    desc: "Los usuarios añaden tus actividades a su agenda con un clic. Llegará a ti un lead calificado y motivado.",
  },
  {
    icon: Gift,
    title: "Cero comisión en beta",
    desc: "Durante la fase beta, aparecer en la plataforma es completamente gratuito. Sin sorpresas.",
  },
];

export default function ProveedoresPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    negocio: "",
    tipo: "",
    mensaje: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="pt-16 min-h-screen bg-surface">
      {/* Hero */}
      <section className="bg-sand border-b border-border py-20">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-3 py-1.5 text-sm font-medium mb-6">
            ✦ Beta abierta — sin comisión
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-ink mb-4 max-w-2xl mx-auto">
            Llega a jóvenes que buscan exactamente lo que ofreces
          </h1>
          <p className="text-ink-light text-lg max-w-xl mx-auto">
            Forma parte de la plataforma donde padres y jóvenes de Barcelona descubren actividades reales como alternativa a las pantallas.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-surface">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-3"
              >
                <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-bold text-lg text-ink">{title}</h3>
                <p className="text-sm text-ink-light leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 bg-sand" id="formulario">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-ink text-center mb-2">
            Quiero aparecer en Explora BCN
          </h2>
          <p className="text-ink-light text-center mb-8">
            Rellena el formulario y nos ponemos en contacto en menos de 48h.
          </p>

          {submitted ? (
            <div className="bg-card border border-green/30 rounded-2xl p-10 text-center" style={{ borderColor: "#86efac" }}>
              <CheckCircle2 className="w-12 h-12 mx-auto mb-4" style={{ color: "#22C55E" }} />
              <h3 className="font-display font-bold text-xl text-ink mb-2">
                ¡Recibido!
              </h3>
              <p className="text-ink-light">
                Nos ponemos en contacto contigo en 48h. Gracias por querer formar parte de la plataforma.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="nombre"
                    className="block text-sm font-medium text-ink mb-1.5"
                  >
                    Tu nombre
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    required
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Ana García"
                    className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-ink-light/50"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-ink mb-1.5"
                  >
                    Email de contacto
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="hola@miacademia.com"
                    className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-ink-light/50"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="negocio"
                  className="block text-sm font-medium text-ink mb-1.5"
                >
                  Nombre del negocio
                </label>
                <input
                  id="negocio"
                  name="negocio"
                  type="text"
                  required
                  value={form.negocio}
                  onChange={handleChange}
                  placeholder="Mi Academia de Surf"
                  className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-ink-light/50"
                />
              </div>

              <div>
                <label
                  htmlFor="tipo"
                  className="block text-sm font-medium text-ink mb-1.5"
                >
                  Tipo de actividad
                </label>
                <select
                  id="tipo"
                  name="tipo"
                  required
                  value={form.tipo}
                  onChange={handleChange}
                  className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Selecciona una categoría</option>
                  <option value="exterior">Exterior / Naturaleza</option>
                  <option value="playa">Playa / Deportes acuáticos</option>
                  <option value="artistica">Artística / Creativa</option>
                  <option value="social">Social / Teatro / Debate</option>
                  <option value="aprendizaje">Aprendizaje / Academia</option>
                  <option value="deporte">Deporte / Fitness</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="mensaje"
                  className="block text-sm font-medium text-ink mb-1.5"
                >
                  Cuéntanos más (opcional)
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows={4}
                  value={form.mensaje}
                  onChange={handleChange}
                  placeholder="¿Qué ofrecéis? ¿En qué barrio? ¿Hay algo especial que quieras destacar?"
                  className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-ink-light/50 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white font-semibold py-3 rounded-full hover:bg-primary-dark transition-colors duration-200 text-base focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Quiero aparecer en Explora BCN
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
