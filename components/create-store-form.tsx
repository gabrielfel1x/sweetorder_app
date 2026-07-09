"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Store } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ActionButton, FieldError, FieldLabel, inputClass } from "@/components/form-kit";
import { createStoreAction } from "@/app/cadastro/actions";
import { createStoreSchema, type CreateStoreFormData } from "@/lib/schemas/signup";

export function CreateStoreForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateStoreFormData>({
    resolver: zodResolver(createStoreSchema),
    defaultValues: { storeName: "", slug: "" },
  });

  const [attempted, setAttempted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isPending, startTransition] = useTransition();

  const slug = watch("slug");
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const onSubmit = handleSubmit(
    (data) => {
      setServerError("");
      startTransition(async () => {
        const formData = new FormData();
        formData.set("storeName", data.storeName);
        formData.set("slug", data.slug);
        const result = await createStoreAction({}, formData);
        if (result?.error) setServerError(result.error);
      });
    },
    () => setAttempted(true)
  );

  return (
    <form onSubmit={onSubmit} noValidate className="w-full flex flex-col gap-5">
      <div>
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
