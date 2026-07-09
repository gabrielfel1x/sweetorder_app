"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Store, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ActionButton, FieldError, FieldLabel, inputClass } from "@/components/form-kit";
import { signUpAction } from "@/app/cadastro/actions";
import { signUpSchema, type SignUpFormData } from "@/lib/schemas/signup";

export function SignupForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "", storeName: "", slug: "" },
  });

  const [attempted, setAttempted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [info, setInfo] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const slug = watch("slug");
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const onSubmit = handleSubmit(
    (data) => {
      setServerError("");
      setInfo("");
      startTransition(async () => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => formData.set(key, value));
        const result = await signUpAction({}, formData);
        if (result?.error) setServerError(result.error);
        if (result?.info) setInfo(result.info);
      });
    },
    () => setAttempted(true)
  );

  if (info) {
    return (
      <div className="text-center flex flex-col items-center gap-3 py-4">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "color-mix(in oklch, var(--brand-sage) 16%, var(--card))" }}
        >
          <Check className="w-7 h-7" style={{ color: "var(--brand-sage)" }} />
        </div>
        <p className="text-foreground font-medium">{info}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="w-full flex flex-col gap-5">
      <div>
        <FieldLabel>Seu nome</FieldLabel>
        <Input
          placeholder="Como podemos te chamar"
          autoComplete="name"
          disabled={isPending}
          className={inputClass(!!errors.name)}
          {...register("name")}
        />
        <FieldError>{errors.name?.message}</FieldError>
      </div>

      <div>
        <FieldLabel>E-mail</FieldLabel>
        <Input
          type="email"
          placeholder="seu@email.com"
          autoComplete="email"
          disabled={isPending}
          className={inputClass(!!errors.email)}
          {...register("email")}
        />
        <FieldError>{errors.email?.message}</FieldError>
      </div>

      <div>
        <FieldLabel>Senha</FieldLabel>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="new-password"
            disabled={isPending}
            className={inputClass(!!errors.password, "rounded-xl h-12 pl-4 pr-11 py-0 leading-[2.75rem] border-2 focus-visible:ring-0 focus-visible:border-foreground transition-colors")}
            {...register("password")}
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
        <FieldError>{errors.password?.message}</FieldError>
      </div>

      <div className="border-t border-border pt-5">
        <FieldLabel>Nome da loja</FieldLabel>
        <Input
          placeholder="Lolo Cookies"
          disabled={isPending}
          className={inputClass(!!errors.storeName)}
          {...register("storeName")}
        />
        <FieldError>{errors.storeName?.message}</FieldError>
      </div>

      <div>
        <FieldLabel>Slug (link público da loja)</FieldLabel>
        <Input
          placeholder="minha-loja"
          disabled={isPending}
          className={inputClass(!!errors.slug)}
          {...register("slug")}
        />
        <FieldError>{errors.slug?.message}</FieldError>
        {slug && !errors.slug && (
          <p className="mt-1.5 text-xs text-muted-foreground truncate">
            {origin || "seudominio.com"}/{slug}
          </p>
        )}
      </div>

      {serverError && (
        <p className="text-center text-sm font-medium text-destructive">{serverError}</p>
      )}
      {attempted && !serverError && Object.keys(errors).length > 0 && (
        <p className="text-center text-xs font-medium text-destructive">
          Preencha todos os campos corretamente
        </p>
      )}

      <ActionButton type="submit" disabled={isPending}>
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            Criar minha loja <Store className="w-4 h-4" />
          </>
        )}
      </ActionButton>
    </form>
  );
}
