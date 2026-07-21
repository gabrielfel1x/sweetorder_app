"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Store as StoreIcon, ArrowRight, Rocket, Smartphone, Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { StoreListItemDTO } from "@/lib/types";

function StoreCard({ store, index }: { store: StoreListItemDTO; index: number }) {
  const color = store.brandColor || "var(--brand-sage)";
  const initial = store.storeName.trim().charAt(0).toUpperCase() || "?";
  const [logoFailed, setLogoFailed] = useState(false);
  const isPublished = store.isPublished;

  const cardContent = (
    <>
      <div className="h-1.5 w-full shrink-0" style={{ backgroundColor: color }} />

      <div
        className="relative aspect-[16/9] flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: logoFailed ? `color-mix(in oklch, ${color} 14%, var(--card))` : "#ffffff" }}
      >
        {logoFailed ? (
          <span
            className="font-heading text-4xl font-bold select-none"
            style={{ letterSpacing: "-0.02em", color }}
          >
            {initial}
          </span>
        ) : (
          <Image
            src={`/logos/${store.slug}.png`}
            alt={store.storeName}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain p-6"
            onError={() => setLogoFailed(true)}
          />
        )}
        {!isPublished && (
          <span className="absolute top-2.5 right-2.5 rounded-full bg-foreground/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-background backdrop-blur-sm">
            Loja em desenvolvimento
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex-1">
          <h3 className="font-heading text-xl font-bold leading-tight tracking-tight text-foreground">
            {store.storeName}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {store.storeDescription}
          </p>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-muted-foreground truncate">/{store.slug}</span>
          {isPublished ? (
            <span
              className="flex items-center gap-1.5 text-sm font-semibold shrink-0"
              style={{ color }}
            >
              Ver loja
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          ) : (
            <span className="text-sm font-semibold shrink-0 text-muted-foreground">
              Em breve
            </span>
          )}
        </div>
      </div>
    </>
  );

  if (!isPublished) {
    return (
      <div
        className="flex flex-col rounded-2xl overflow-hidden border border-border bg-card opacity-80 cursor-default"
        style={{
          animation: `card-in 0.55s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.06}s both`,
        }}
        aria-disabled="true"
      >
        {cardContent}
      </div>
    );
  }

  return (
    <Link
      href={`/${store.slug}`}
      className="group flex flex-col rounded-2xl overflow-hidden border border-border bg-card hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300"
      style={{
        animation: `card-in 0.55s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.06}s both`,
      }}
    >
      {cardContent}
    </Link>
  );
}

export function StoreDirectory({ stores }: { stores: StoreListItemDTO[] }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return stores;
    return stores.filter(
      (s) =>
        s.storeName.toLowerCase().includes(q) || s.storeDescription.toLowerCase().includes(q)
    );
  }, [stores, search]);

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle 700px at 0% 280px, rgba(0, 0, 0, 0.035), transparent),
            radial-gradient(circle 700px at 100% 280px, rgba(0, 0, 0, 0.025), transparent)
          `,
        }}
      />

      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="hidden sm:flex max-w-7xl mx-auto px-4 sm:px-6 h-16 items-center gap-4">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Buscar lojas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 pl-10 rounded-full text-sm"
            />
          </div>
        </div>

        <div className="sm:hidden px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Buscar lojas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 pl-10 rounded-full text-sm"
            />
          </div>
        </div>
      </header>

      <section className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 pt-12 pb-8">
        <h1 className="font-heading text-3xl sm:text-4xl font-black tracking-tight text-foreground">
          Encontre uma loja
        </h1>
        <p className="mt-1.5 text-muted-foreground max-w-md">
          Cada loja aqui tem seu próprio catálogo e faz a entrega direto para você.
        </p>
      </section>

      <main className="relative flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 pb-16">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <span className="flex items-center justify-center w-14 h-14 rounded-full bg-secondary">
              <Search className="w-6 h-6 text-muted-foreground" />
            </span>
            <h2 className="font-heading text-2xl font-bold text-foreground">
              {stores.length === 0 ? "Nenhuma loja por aqui ainda" : "Nenhuma loja encontrada"}
            </h2>
            <p className="text-muted-foreground">
              {stores.length === 0
                ? "Assim que uma loja for cadastrada, ela aparece por aqui."
                : "Tente buscar por outro nome."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((store, index) => (
              <StoreCard key={store.id} store={store} index={index} />
            ))}
          </div>
        )}
      </main>

      <section className="relative border-t border-border bg-secondary/40">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-14">
          <div className="flex flex-col items-center text-center max-w-xl mx-auto">
            <span
              className="flex items-center justify-center w-12 h-12 rounded-xl mb-4"
              style={{ backgroundColor: "var(--secondary)" }}
            >
              <StoreIcon className="w-5 h-5" style={{ color: "var(--brand-sage)" }} />
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Tem uma loja artesanal?
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Crie seu catálogo, receba pedidos pelo WhatsApp e comece a
              vender online em poucos minutos.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col items-center text-center gap-2 p-5 rounded-2xl border border-border bg-card">
              <Rocket className="w-5 h-5" style={{ color: "var(--brand-sage)" }} />
              <h3 className="font-heading font-bold text-foreground">Comece rápido</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Monte seu catálogo e publique sua loja em minutos, sem
                precisar de site próprio.
              </p>
            </div>
            <div className="flex flex-col items-center text-center gap-2 p-5 rounded-2xl border border-border bg-card">
              <Smartphone className="w-5 h-5" style={{ color: "var(--brand-amber)" }} />
              <h3 className="font-heading font-bold text-foreground">Pedidos pelo WhatsApp</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Cada pedido chega direto no seu WhatsApp, sem app novo pra
                aprender.
              </p>
            </div>
            <div className="flex flex-col items-center text-center gap-2 p-5 rounded-2xl border border-border bg-card">
              <Wallet className="w-5 h-5" style={{ color: "var(--brand-sage)" }} />
              <h3 className="font-heading font-bold text-foreground">Você no controle</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Defina preços, entrega e formas de pagamento do seu jeito.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
