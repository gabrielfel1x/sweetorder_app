import { notFound } from "next/navigation";
import { CartProvider } from "@/lib/cart-context";
import { getStoreBySlug } from "@/lib/settings";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const settings = await getStoreBySlug(slug);
  if (!settings) return {};
  return {
    title: settings.storeName,
    description: settings.storeDescription,
  };
}

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const settings = await getStoreBySlug(slug);
  if (!settings) notFound();

  return <CartProvider settings={settings}>{children}</CartProvider>;
}
