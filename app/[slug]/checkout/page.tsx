import { notFound } from "next/navigation";
import { Checkout } from "@/components/checkout";
import { getStoreBySlug } from "@/lib/settings";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const settings = await getStoreBySlug(slug);
  if (!settings) return {};
  return { title: `Finalizar Pedido — ${settings.storeName}` };
}

export default async function CheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const settings = await getStoreBySlug(slug);
  if (!settings) notFound();

  return <Checkout settings={settings} slug={slug} />;
}
