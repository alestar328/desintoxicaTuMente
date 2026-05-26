"use client";

// Envuelve la app con todos los context providers de cliente.
// Separado del layout (Server Component) para evitar errores de hidratación.

import { AuthProvider } from "@/lib/auth-context";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
