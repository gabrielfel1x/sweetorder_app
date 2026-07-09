"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Cookie, Search, Store as StoreIcon, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { StoreListItemDTO } from "@/lib/types";

const CARD_PALETTE = ["#F2E0C4", "#E3EBDD", "#F5DCE0", "#DCE6F2", "#F0E4F7", "#FBE7CE"];
const CARD_EMOJI = ["🍪", "🧁", "🍩", "🍰", "🥐", "🍫"];

function pickFromSlug<T>(slug: string, palette: T[]): T {
  const hash = Array.from(slug).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return palette[hash % palette.length];
}

function StoreCard({ store, index }: { store: StoreListItemDTO; index: number }) {
  const bg = pickFromSlug(store.slug, CARD_PALETTE);
  const emoji = pickFromSlug(store.slug, CARD_EMOJI);

  return (
    <Link
      href={`/${store.slug}`}
      className="group flex flex-col rounded-2xl overflow-hidden border border-border bg-card hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300"
      style={{
        animation: `card-in 0.55s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.07}s both`,
      }}
    >
      <div
        className="relative aspect-[16/9] flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: bg }}
      >
        <span className="text-6xl select-none transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-[-8deg] drop-shadow-md">
          {emoji}
        </span>
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
          <span
            className="flex items-center gap-1.5 text-sm font-semibold shrink-0"
            style={{ color: "var(--brand-sage)" }}
          >
            Ver loja
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
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
      {/* Pattern: soft-corner-vignette (neutral, page-wide) */}
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <span className="flex items-center gap-2 shrink-0">
            <Cookie
              className="w-5 h-5 transition-transform duration-500 hover:rotate-12"
              style={{ color: "var(--brand-sage)" }}
            />
            <span
              className="font-heading text-xl font-bold tracking-tight"
              style={{ color: "var(--brand-sage)" }}
            >
              SweetOrder
            </span>
          </span>

          <div className="flex-1 max-w-lg mx-auto relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Buscar lojas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 pl-10 rounded-full bg-secondary border-0 text-sm focus-visible:ring-primary/40 transition-all"
            />
          </div>
        </div>
      </header>

      <section className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 pt-14 pb-10 overflow-hidden">
        {/* Pattern: diagonal-cross-grid-top */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage: `
              linear-gradient(45deg, transparent 49%, #e0d5c5 49%, #e0d5c5 51%, transparent 51%),
              linear-gradient(-45deg, transparent 49%, #e0d5c5 49%, #e0d5c5 51%, transparent 51%)
            `,
            backgroundSize: "40px 40px",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
          }}
        />

        <span
          aria-hidden
          className="pointer-events-none absolute right-[15%] top-4 text-5xl opacity-100 animate-float-cookie select-none"
          style={{ animationDelay: "0s" }}
        >
          🍪
        </span>
        <span
          aria-hidden
          className="pointer-events-none absolute right-[6%] top-16 text-3xl opacity-100 animate-float-cookie select-none"
          style={{ animationDelay: "1.2s" }}
        >
          🧁
        </span>

        <h1
          className="font-heading text-5xl sm:text-6xl lg:text-7xl font-black leading-none tracking-tight text-foreground animate-slide-up"
          style={{ animationDelay: "0s" }}
        >
          Escolha sua
          <br />
          <span style={{ color: "var(--brand-amber)" }}>lojinha.</span>
        </h1>

        <p
          className="mt-5 text-base sm:text-lg text-muted-foreground max-w-sm leading-relaxed animate-slide-up"
          style={{ animationDelay: "0.12s" }}
        >
          Cada loja tem seu próprio catálogo, entregue direto pra você.
        </p>

        <div
          className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground animate-slide-up"
          style={{ animationDelay: "0.22s" }}
        >
          <span className="flex items-center gap-1.5">
            <StoreIcon className="w-3.5 h-3.5" style={{ color: "var(--brand-amber)" }} />
            <span className="font-heading font-semibold text-foreground">{stores.length}</span>{" "}
            {stores.length === 1 ? "loja cadastrada" : "lojas cadastradas"}
          </span>
        </div>
      </section>

      <main className="relative flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 pb-16">
        {/* Pattern: dashed-grid-light (very subtle texture behind cards) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, #ddd6cc 1px, transparent 1px),
              linear-gradient(to bottom, #ddd6cc 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
            maskImage: `
              repeating-linear-gradient(to right, black 0px, black 2px, transparent 2px, transparent 8px),
              repeating-linear-gradient(to bottom, black 0px, black 2px, transparent 2px, transparent 8px)
            `,
            WebkitMaskImage: `
              repeating-linear-gradient(to right, black 0px, black 2px, transparent 2px, transparent 8px),
              repeating-linear-gradient(to bottom, black 0px, black 2px, transparent 2px, transparent 8px)
            `,
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in",
            opacity: 0.5,
          }}
        />

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <span className="text-6xl animate-pulse-soft select-none">🍪</span>
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
    </div>
  );
}
