"use client";

import { useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { FieldError, FieldLabel, inputClass } from "@/components/form-kit";
import { STORE_ICONS, STORE_ICON_NAMES } from "@/lib/store-icons";
import { uploadStoreLogo } from "@/app/admin/loja/actions";
import type { SettingsFormData } from "@/components/admin/store-settings-form";

function StoreLogoField({
  value,
  onChange,
  disabled,
}: {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file: File) => {
    setError("");
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadStoreLogo(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      onChange(result.url ?? null);
    } catch {
      setError("Erro ao enviar imagem. Tente uma foto menor ou verifique sua conexão.");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <FieldLabel>Logo da loja</FieldLabel>
      <div className="flex items-center gap-3">
        {value ? (
          <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 border-border bg-white">
            <Image src={value} alt="" fill sizes="64px" className="object-contain p-1" />
            <button
              type="button"
              onClick={() => onChange(null)}
              disabled={disabled || isUploading}
              className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer"
              aria-label="Remover logo"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="w-16 h-16 rounded-xl border-2 border-dashed border-border flex items-center justify-center shrink-0 text-muted-foreground">
            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImagePlus className="w-5 h-5" />}
          </div>
        )}
        <div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled || isUploading}
            className="h-9 px-4 rounded-full text-sm font-medium bg-secondary hover:bg-border transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isUploading ? "Enviando..." : value ? "Trocar logo" : "Escolher logo"}
          </button>
          <p className="mt-1 text-xs text-muted-foreground">JPG, PNG ou WEBP, até 5MB.</p>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      {error && <p className="mt-1.5 text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}

export function GeneralFields({ isPending }: { isPending: boolean }) {
  const {
    register,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<SettingsFormData>();

  const slug = watch("slug");
  const isPublished = watch("isPublished");
  const logoUrl = watch("logoUrl");
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="bg-card border-2 border-border rounded-3xl p-5 md:p-8 flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4 rounded-2xl border-2 border-border p-4">
        <div>
          <span className="font-heading font-bold text-sm">Loja publicada</span>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {isPublished
              ? "Sua loja aparece no diretório inicial, junto com as outras."
              : "Sua loja fica fora do diretório inicial. Só quem tiver o link direto (/" + (slug || "sua-loja") + ") consegue acessar. Use para terminar de configurar antes de abrir ao público."}
          </p>
        </div>
        <Controller
          name="isPublished"
          control={control}
          render={({ field }) => (
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={isPending}
              aria-label="Loja publicada"
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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

      <div>
        <StoreLogoField
          value={logoUrl}
          onChange={(url) => setValue("logoUrl", url, { shouldValidate: true })}
          disabled={isPending}
        />
        <FieldError>{errors.logoUrl?.message}</FieldError>
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
            {origin || "seudominio.com"}/{slug}
          </p>
        )}
      </div>

      <div>
        <FieldLabel>Cor do card</FieldLabel>
        <Controller
          name="brandColor"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-3">
              <input
                type="color"
                disabled={isPending}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className="h-12 w-14 shrink-0 rounded-xl border-2 border-border bg-transparent p-1 cursor-pointer disabled:cursor-not-allowed"
                aria-label="Selecionar cor do card"
              />
              <Input
                placeholder="#4f7a5c"
                disabled={isPending}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className={inputClass(!!errors.brandColor, "rounded-xl h-12 px-4 py-0 leading-[2.75rem] border-2 focus-visible:ring-0 focus-visible:border-foreground transition-colors font-mono")}
              />
            </div>
          )}
        />
        <FieldError>{errors.brandColor?.message}</FieldError>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Usada para destacar sua loja no diretório inicial.
        </p>
      </div>

      <div>
        <FieldLabel>Cor do tema do site</FieldLabel>
        <Controller
          name="themeColor"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-3">
              <input
                type="color"
                disabled={isPending}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className="h-12 w-14 shrink-0 rounded-xl border-2 border-border bg-transparent p-1 cursor-pointer disabled:cursor-not-allowed"
                aria-label="Selecionar cor do tema do site"
              />
              <Input
                placeholder="#4f7a5c"
                disabled={isPending}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className={inputClass(!!errors.themeColor, "rounded-xl h-12 px-4 py-0 leading-[2.75rem] border-2 focus-visible:ring-0 focus-visible:border-foreground transition-colors font-mono")}
              />
            </div>
          )}
        />
        <FieldError>{errors.themeColor?.message}</FieldError>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Usada nos botões e destaques dentro do catálogo, checkout e painel da sua loja.
        </p>
      </div>

      <div>
        <FieldLabel>Ícone da loja</FieldLabel>
        <Controller
          name="brandIcon"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
              {STORE_ICON_NAMES.map((name) => {
                const Icon = STORE_ICONS[name];
                const selected = field.value === name;
                return (
                  <button
                    key={name}
                    type="button"
                    disabled={isPending}
                    onClick={() => field.onChange(name)}
                    aria-label={name}
                    aria-pressed={selected}
                    className={`flex items-center justify-center h-11 rounded-xl border-2 transition-colors disabled:cursor-not-allowed ${
                      selected
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          )}
        />
        <FieldError>{errors.brandIcon?.message}</FieldError>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Aparece no cabeçalho e na vitrine da sua loja.
        </p>
      </div>
    </div>
  );
}
