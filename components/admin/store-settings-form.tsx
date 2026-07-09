"use client";

import { useState, useTransition } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActionButton } from "@/components/form-kit";
import { GeneralFields } from "@/components/admin/settings/general-fields";
import { ContactFields } from "@/components/admin/settings/contact-fields";
import { DeliveryPaymentFields } from "@/components/admin/settings/delivery-payment-fields";
import { BusinessHoursFields } from "@/components/admin/settings/business-hours-fields";
import { updateStoreSettings } from "@/app/admin/loja/actions";
import { storeSettingsSchema, type StoreSettingsFormData } from "@/lib/schemas/store-settings";
import type { BusinessHourDayDTO, StoreSettingsDTO } from "@/lib/types";

export type SettingsFormData = StoreSettingsFormData;

export function StoreSettingsForm({
  initialSettings,
  initialBusinessHours,
}: {
  initialSettings: StoreSettingsDTO;
  initialBusinessHours: BusinessHourDayDTO[];
}) {
  const methods = useForm<SettingsFormData>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: initialSettings,
  });
  const { handleSubmit } = methods;

  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState("");
  const [saved, setSaved] = useState(false);

  const onSubmit = handleSubmit((data) => {
    setServerError("");
    setSaved(false);
    startTransition(async () => {
      const result = await updateStoreSettings(data);
      if (result?.error) {
        setServerError(result.error);
        return;
      }
      setSaved(true);
    });
  });

  return (
    <div>
      <h1 className="font-heading text-3xl font-black tracking-tight">Configurações da loja</h1>
      <p className="mt-1.5 text-muted-foreground">
        Personalize sua loja: identidade, contato, horários, entrega e pagamento.
      </p>

      <Tabs defaultValue="geral" className="mt-6 max-w-3xl">
        <TabsList>
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="contato">Contato</TabsTrigger>
          <TabsTrigger value="horarios">Horários</TabsTrigger>
          <TabsTrigger value="entrega">Entrega & Pagamento</TabsTrigger>
        </TabsList>

        <FormProvider {...methods}>
          <form onSubmit={onSubmit} noValidate>
            <TabsContent value="geral">
              <GeneralFields isPending={isPending} />
            </TabsContent>
            <TabsContent value="contato">
              <ContactFields isPending={isPending} />
            </TabsContent>
            <TabsContent value="entrega">
              <DeliveryPaymentFields isPending={isPending} />
            </TabsContent>

            {serverError && (
              <p className="text-center text-sm font-medium text-destructive mt-4">{serverError}</p>
            )}

            <div className="mt-6 flex items-center gap-4">
              <div className="flex-1">
                <ActionButton type="submit" disabled={isPending}>
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar alterações"}
                </ActionButton>
              </div>
              {saved && !isPending && (
                <span className="flex items-center gap-1.5 text-sm font-semibold shrink-0" style={{ color: "var(--brand-sage)" }}>
                  <Check className="w-4 h-4" /> Salvo com sucesso
                </span>
              )}
            </div>
          </form>
        </FormProvider>

        <TabsContent value="horarios">
          <BusinessHoursFields initialBusinessHours={initialBusinessHours} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
