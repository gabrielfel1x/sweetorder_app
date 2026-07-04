"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ActionButton, FieldError, FieldLabel, inputClass } from "@/components/form-kit";
import { loginAction } from "@/app/login/actions";

const loginSchema = z.object({
  email: z.string().trim().min(1, "E-mail é obrigatório").email("E-mail inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const [attempted, setAttempted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const onSubmit = handleSubmit(
    (data) => {
      setServerError("");
      startTransition(async () => {
        const formData = new FormData();
        formData.set("email", data.email);
        formData.set("password", data.password);
        const result = await loginAction({}, formData);
        if (result?.error) setServerError(result.error);
      });
    },
    () => setAttempted(true)
  );

  return (
    <form onSubmit={onSubmit} noValidate className="w-full">
      <div className="mb-6">
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
            autoComplete="current-password"
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

      {serverError && (
        <p className="text-center text-sm font-medium text-destructive mt-4">{serverError}</p>
      )}
      {attempted && !serverError && (errors.email || errors.password) && (
        <p className="text-center text-xs font-medium text-destructive mt-4">
          Preencha todos os campos corretamente
        </p>
      )}

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
  );
}
