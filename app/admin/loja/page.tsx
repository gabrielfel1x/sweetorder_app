import { getStoreById } from "@/lib/settings";
import { getBusinessHours } from "@/lib/business-hours";
import { requireAdmin } from "@/lib/session-helpers";
import { StoreSettingsForm } from "@/components/admin/store-settings-form";

export const metadata = {
  title: "Configurações da loja — Painel administrativo",
};

export default async function AdminStorePage() {
  const admin = await requireAdmin();
  const [settings, businessHours] = await Promise.all([
    getStoreById(admin.storeId),
    getBusinessHours(admin.storeId),
  ]);
  return <StoreSettingsForm initialSettings={settings} initialBusinessHours={businessHours} />;
}
