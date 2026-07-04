"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldError, FieldLabel, inputClass } from "@/components/form-kit";
import type { SettingsFormData } from "@/components/admin/store-settings-form";

export function GeneralFields({ isPending }: { isPending: boolean }) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<SettingsFormData>();

  const slug = watch("slug");
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="bg-card border-2 border-border rounded-3xl p-5 flex flex-col gap-4">
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
        <FieldLabel>Descrição</FieldLabel>
        <Textarea
          placeholder="Uma frase curta sobre a loja"
          disabled={isPending}
          rows={2}
          className={inputClass(
            !!errors.storeDescription,
            "rounded-xl px-4 py-2.5 border-2 focus-visible:ring-0 focus-visible:border-foreground transition-colors resize-none"
          )}
          {...register("storeDescription")}
        />
        <FieldError>{errors.storeDescription?.message}</FieldError>
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
            {origin || "seudominio.com"}/loja/{slug}
          </p>
        )}
      </div>

      <div>
        <FieldLabel>E-mail de contato</FieldLabel>
        <Input
          type="email"
          placeholder="contato@sualoja.com"
          disabled={isPending}
          className={inputClass(!!errors.email)}
          {...register("email")}
        />
        <FieldError>{errors.email?.message}</FieldError>
      </div>
    </div>
  );
}
