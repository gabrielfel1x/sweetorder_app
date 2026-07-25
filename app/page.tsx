import { SiteHeader } from "@/components/marketing/site-header";
import { Hero } from "@/components/marketing/hero";
import { Features } from "@/components/marketing/features";
import { StoresSection } from "@/components/marketing/stores-section";
import { Faq } from "@/components/marketing/faq";
import { CtaBand } from "@/components/marketing/cta-band";
import { SiteFooter } from "@/components/marketing/site-footer";
import { getAllStores } from "@/lib/settings";

export default async function Home() {
  const stores = await getAllStores();
  const publishedCount = stores.filter((s) => s.isPublished).length;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <Hero publishedCount={publishedCount} />
      <Features />
      <StoresSection stores={stores} />
      <Faq />
      <CtaBand />
      <SiteFooter />
    </div>
  );
}
