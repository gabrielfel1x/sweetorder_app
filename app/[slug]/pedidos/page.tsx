import { notFound } from "next/navigation";
import { CustomerOrders } from "@/components/customer-orders";
import { getStoreBySlug } from "@/lib/settings";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const settings = await getStoreBySlug(slug);
  if (!settings) return {};
  return { title: `Meus pedidos • ${settings.storeName}` };
}

export default async function OrdersPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const settings = await getStoreBySlug(slug);
  if (!settings) notFound();

  return (
    <CustomerOrders
      storeId={settings.id}
      storeName={settings.storeName}
      brandIcon={settings.brandIcon}
      slug={slug}
    />
  );
}
