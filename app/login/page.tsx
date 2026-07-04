import { redirect } from "next/navigation";
import { Cookie } from "lucide-react";
import { getCurrentAdmin } from "@/lib/session-helpers";
import { LoginForm } from "@/components/login-form";
import { getStoreSettings } from "@/lib/settings";

export const metadata = {
  title: "Entrar — Painel administrativo",
};

export default async function LoginPage() {
  const admin = await getCurrentAdmin();
  if (admin) redirect("/admin");

  const settings = await getStoreSettings();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ backgroundColor: "color-mix(in oklch, var(--brand-sage) 14%, var(--card))" }}
          >
            <span className="text-4xl select-none">🍪</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <Cookie className="w-4 h-4" style={{ color: "var(--brand-sage)" }} />
            <span
              className="font-heading text-base font-bold tracking-tight"
              style={{ color: "var(--brand-sage)" }}
            >
              {settings.storeName}
            </span>
          </div>
          <h1 className="font-heading text-4xl font-black tracking-tight leading-tight">
            Entrar
          </h1>
          <p className="mt-2 text-muted-foreground">
            Acesse o painel administrativo da loja.
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
