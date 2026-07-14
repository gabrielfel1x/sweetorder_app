"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Cookie, Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ActionButton, FieldError, FieldLabel, inputClass } from "@/components/form-kit";
import { createClient as createBrowserClient } from "@/lib/supabase/client";

export default function InvitePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const supabase = createBrowserClient();
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(!!data.session);
      setChecking(false);
    });
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("A senha precisa ter ao menos 6 caracteres");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    startTransition(async () => {
      const supabase = createBrowserClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError("Não foi possível definir a senha. Tente novamente.");
        return;
      }
      router.push("/admin");
      router.refresh();
    });
  }

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
              SweetOrder
            </span>
          </div>
          <h1 className="font-heading text-4xl font-black tracking-tight leading-tight">
            Bem-vindo!
          </h1>
          <p className="mt-2 text-muted-foreground">
            Defina sua senha para acessar o painel da sua loja.
          </p>
        </div>

        {checking ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : !hasSession ? (
          <p className="text-center text-sm text-muted-foreground">
            Este link de convite é inválido ou expirou. Peça um novo convite.
          </p>
        ) : (
          <form onSubmit={onSubmit} noValidate className="w-full">
            <div className="mb-6">
              <FieldLabel>Nova senha</FieldLabel>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  disabled={isPending}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass(false, "rounded-xl h-12 pl-4 pr-11 py-0 leading-[2.75rem] border-2 focus-visible:ring-0 focus-visible:border-foreground transition-colors")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <FieldLabel>Confirme a senha</FieldLabel>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={isPending}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClass(false)}
              />
            </div>

            {error && <p className="text-center text-sm font-medium text-destructive mt-4">{error}</p>}

            <div className="mt-8">
              <ActionButton type="submit" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Entrar <LogIn className="w-4 h-4" />
                  </>
                )}
              </ActionButton>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
