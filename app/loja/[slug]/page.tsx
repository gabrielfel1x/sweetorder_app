import { notFound } from "next/navigation";
import { Catalog } from "@/components/catalog";
import { getActiveProducts } from "@/lib/products";
import { getStoreSettings } from "@/lib/settings";
import { getBusinessHours } from "@/lib/business-hours";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const settings = await getStoreSettings();
  if (settings.slug !== slug) return {};
  return { title: settings.storeName };
}

export default async function LojaSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [products, settings, businessHours] = await Promise.all([
    getActiveProducts(),
    getStoreSettings(),
    getBusinessHours(),
  ]);

  if (settings.slug !== slug) notFound();

  return (
    <Catalog
      products={products}
      storeName={settings.storeName}
      freeDeliveryThreshold={settings.freeDeliveryThreshold}
      businessHours={businessHours}
    />
  );
}
