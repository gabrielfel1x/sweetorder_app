"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ActionButton, FieldError, FieldLabel, inputClass } from "@/components/form-kit";
import { inviteClientSchema, type InviteClientFormData } from "@/lib/schemas/superadmin";
import { inviteClientAction } from "@/app/superadmin/clientes/novo/actions";

export function NewClientForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteClientFormData>({
    resolver: zodResolver(inviteClientSchema),
    defaultValues: { name: "", email: "", storeName: "", slug: "" },
  });

  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const onSubmit = handleSubmit((data) => {
    setServerError("");
    startTransition(async () => {
      const formData = new FormData();
      formData.set("name", data.name);
      formData.set("email", data.email);
      formData.set("storeName", data.storeName);
      formData.set("slug", data.slug);
      const result = await inviteClientAction({}, formData);
      if (result?.error) {
        setServerError(result.error);
        return;
      }
      setSuccess(true);
      reset();
      router.refresh();
    });
  });

  if (success) {
    return (
      <div className="rounded-2xl border-2 border-border bg-card p-6 flex flex-col items-center text-center gap-3">
        <CheckCircle2 className="w-10 h-10" style={{ color: "var(--brand-sage)" }} />
        <p className="font-heading font-bold text-lg">Convite enviado!</p>
        <p className="text-sm text-muted-foreground">
          A loja foi criada e um e-mail de convite foi enviado para o cliente definir a senha.
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-2 text-sm font-semibold text-foreground hover:underline cursor-pointer"
        >
          Cadastrar outro cliente
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="w-full flex flex-col gap-5">
      <div>
        <FieldLabel>Nome do cliente</FieldLabel>
        <Input
          placeholder="Maria Silva"
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
          placeholder="cliente@email.com"
          disabled={isPending}
          className={inputClass(!!errors.email)}
          {...register("email")}
        />
        <FieldError>{errors.email?.message}</FieldError>
      </div>

      <div>
        <FieldLabel>Nome da loja</FieldLabel>
        <Input
          placeholder="Cookies da Maria"
          disabled={isPending}
          className={inputClass(!!errors.storeName)}
          {...register("storeName")}
        />
        <FieldError>{errors.storeName?.message}</FieldError>
      </div>

      <div>
        <FieldLabel>Slug (URL da loja)</FieldLabel>
        <Input
          placeholder="cookies-da-maria"
          disabled={isPending}
          className={inputClass(!!errors.slug)}
          {...register("slug")}
        />
        <FieldError>{errors.slug?.message}</FieldError>
      </div>

      {serverError && (
        <p className="text-center text-sm font-medium text-destructive">{serverError}</p>
      )}

      <ActionButton type="submit" disabled={isPending}>
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            Enviar convite <Send className="w-4 h-4" />
          </>
        )}
      </ActionButton>
    </form>
  );
}
