import { notFound } from "next/navigation";
import { Checkout } from "@/components/checkout";
import { getStoreBySlug } from "@/lib/settings";
import { getBusinessHours } from "@/lib/business-hours";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const settings = await getStoreBySlug(slug);
  if (!settings) return {};
  return { title: `Finalizar Pedido • ${settings.storeName}` };
}

export default async function CheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const settings = await getStoreBySlug(slug);
  if (!settings) notFound();

  const businessHours = await getBusinessHours(settings.id);

  return <Checkout settings={settings} slug={slug} businessHours={businessHours} />;
}
