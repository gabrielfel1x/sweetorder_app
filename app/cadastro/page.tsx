import { redirect } from "next/navigation";
import { Clock } from "lucide-react";
import { getAuthUser, getCurrentAdmin } from "@/lib/session-helpers";
import { SignupForm } from "@/components/signup-form";
import { CreateStoreForm } from "@/components/create-store-form";

export const metadata = {
  title: "Cadastre sua loja • PedeNaHora",
};

export default async function CadastroPage() {
  const user = await getAuthUser();

  if (user) {
    const admin = await getCurrentAdmin();
    if (admin) redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center text-center mb-8">
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
            {user ? "Quase lá" : "Crie sua loja"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {user
              ? "Sua conta já existe, falta só configurar a sua loja."
              : "Monte seu catálogo e comece a vender em minutos."}
          </p>
        </div>

        {user ? <CreateStoreForm /> : <SignupForm />}

        {!user && (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Já tem uma loja?{" "}
            <a href="/login" className="font-semibold text-foreground hover:underline">
              Entrar
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
