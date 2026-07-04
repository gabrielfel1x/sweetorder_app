import { getStoreSettings } from "@/lib/settings";
import { getBusinessHours } from "@/lib/business-hours";
import { StoreSettingsForm } from "@/components/admin/store-settings-form";

export const metadata = {
  title: "Configurações da loja — Painel administrativo",
};

export default async function AdminStorePage() {
  const [settings, businessHours] = await Promise.all([getStoreSettings(), getBusinessHours()]);
  return <StoreSettingsForm initialSettings={settings} initialBusinessHours={businessHours} />;
}
