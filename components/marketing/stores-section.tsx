"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { StoreListItemDTO } from "@/lib/types";

function StoreCard({ store, index }: { store: StoreListItemDTO; index: number }) {
  const color = store.brandColor || "var(--brand-sage)";
  const initial = store.storeName.trim().charAt(0).toUpperCase() || "?";
  const [logoFailed, setLogoFailed] = useState(false);
  const isPublished = store.isPublished;
  const showLogo = !!store.logoUrl && !logoFailed;

  const cardContent = (
    <>
      <div className="h-1.5 w-full shrink-0" style={{ backgroundColor: color }} />

      <div
        className="relative aspect-[16/9] flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: showLogo ? "#ffffff" : `color-mix(in oklch, ${color} 14%, var(--card))` }}
      >
        {showLogo ? (
          <Image
            src={store.logoUrl!}
            alt={store.storeName}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain p-6"
            onError={() => setLogoFailed(true)}
          />
        ) : (
          <span
            className="font-heading text-4xl font-bold select-none"
            style={{ letterSpacing: "-0.02em", color }}
          >
            {initial}
          </span>
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

export function StoresSection({ stores }: { stores: StoreListItemDTO[] }) {
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
    <section id="lojas" className="border-t border-border bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-8">
          <div>
            <span
              className="text-xs font-bold uppercase tracking-wide"
              style={{ color: "var(--brand-sage)" }}
            >
              Lojas
            </span>
            <h2 className="mt-2 font-heading text-3xl sm:text-4xl font-black tracking-tight">
              Quem já vende no PedeNaHora
            </h2>
            <p className="mt-2 text-muted-foreground max-w-md">
              Cada loja aqui tem seu próprio catálogo e cuida da entrega do seu jeito.
            </p>
          </div>

          <div className="relative w-full sm:w-72 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Buscar lojas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 pl-10 rounded-full text-sm bg-card"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <span className="flex items-center justify-center w-14 h-14 rounded-full bg-card border border-border">
              <Search className="w-6 h-6 text-muted-foreground" />
            </span>
            <h3 className="font-heading text-xl font-bold text-foreground">
              {stores.length === 0 ? "Sua loja pode ser a primeira por aqui" : "Nenhuma loja encontrada"}
            </h3>
            <p className="text-muted-foreground max-w-sm">
              {stores.length === 0
                ? "Assim que uma loja for cadastrada, ela aparece nessa vitrine."
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
      </div>
    </section>
  );
}
