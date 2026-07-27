import { redirect } from "next/navigation";
import { Clock } from "lucide-react";
import { getAuthUser, getCurrentAdmin } from "@/lib/session-helpers";
import { LoginForm } from "@/components/login-form";

export const metadata = {
  title: "Entrar • Painel administrativo",
};

function safeRedirectTarget(from: string | undefined): string | null {
  if (!from) return null;
  if (!from.startsWith("/") || from.startsWith("//")) return null;
  if (from === "/login") return null;
  return from;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  const safeFrom = safeRedirectTarget(from);

  const user = await getAuthUser();
  if (user) {
    const admin = await getCurrentAdmin();
    redirect(safeFrom ?? (admin ? "/admin" : "/cadastro"));
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-6 h-6" strokeWidth={2.75} style={{ color: "var(--brand-sage)" }} />
            <span
              className="font-heading text-lg font-bold tracking-tight"
              style={{ color: "var(--brand-sage)" }}
            >
              PedeNaHora
            </span>
          </div>
          <h1 className="font-heading text-4xl font-black tracking-tight leading-tight">
            Entrar
          </h1>
          <p className="mt-2 text-muted-foreground">
            Acesse o painel administrativo da loja.
          </p>
        </div>

        <div className="rounded-3xl border-2 border-border bg-card p-6 sm:p-8">
          <LoginForm from={safeFrom ?? undefined} />
        </div>
      </div>
    </div>
  );
}
