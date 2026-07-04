"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Search,
  Plus,
  Minus,
  X,
  Cookie,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart, type CookieItem, type CartEntry } from "@/lib/cart-context";
import {
  getBusinessHoursStatus,
  formatShiftsList,
  type BusinessHoursStatus,
} from "@/lib/business-hours-status";
import type { BusinessHourDayDTO } from "@/lib/types";

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function CookieCard({
  cookie,
  quantity,
  index,
  onAdd,
  onRemove,
}: {
  cookie: CookieItem;
  quantity: number;
  index: number;
  onAdd: () => void;
  onRemove: () => void;
}) {
  return (
    <article
      className="group flex flex-col rounded-2xl overflow-hidden border border-border bg-card hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300"
      style={{
        animation: `card-in 0.55s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.07}s both`,
      }}
    >
      <div
        className="relative aspect-square flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: cookie.visual.bg }}
      >
        <span className="text-7xl select-none transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-[-8deg] drop-shadow-md">
          {cookie.visual.emoji}
        </span>

        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {quantity > 0 && (
          <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-heading font-bold px-2.5 py-1 rounded-full shadow-md">
            {quantity}× no carrinho
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex-1">
          <h3 className="font-heading text-xl font-bold leading-tight tracking-tight text-foreground">
            {cookie.name}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {cookie.description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1">
          <span className="font-heading text-2xl font-extrabold text-foreground tracking-tight">
            {fmt(cookie.price)}
          </span>

          {quantity === 0 ? (
            <Button
              size="sm"
              onClick={onAdd}
              className="rounded-full h-9 px-4 gap-1.5 text-sm font-semibold active:scale-95 transition-transform w-full sm:w-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              Adicionar
            </Button>
          ) : (
            <div className="flex items-center gap-1 bg-secondary rounded-full p-1 w-full sm:w-auto justify-between sm:justify-start">
              <button
                onClick={onRemove}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-border transition-colors cursor-pointer active:scale-90"
                aria-label="Remover um"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-heading text-base font-bold w-5 text-center select-none tabular-nums">
                {quantity}
              </span>
              <button
                onClick={onAdd}
                className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-all cursor-pointer active:scale-90"
                aria-label="Adicionar um"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function CartItemRow({
  entry,
  onAdd,
  onRemove,
  onDelete,
}: {
  entry: CartEntry;
  onAdd: () => void;
  onRemove: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-4 py-4">
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl"
        style={{ backgroundColor: entry.visual.bg }}
      >
        {entry.visual.emoji}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-heading text-base font-bold leading-tight truncate">
          {entry.name}
        </p>
        <p className="text-sm text-muted-foreground mb-2">{fmt(entry.price)} cada</p>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onRemove}
            className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors cursor-pointer active:scale-90"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="font-heading text-base font-bold w-4 text-center tabular-nums">
            {entry.quantity}
          </span>
          <button
            onClick={onAdd}
            className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-all cursor-pointer active:scale-90"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      <button
        onClick={onDelete}
        className="self-start mt-1 w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-secondary transition-colors cursor-pointer flex-shrink-0"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

export function Catalog({
  products,
  storeName,
  freeDeliveryThreshold,
  businessHours,
}: {
  products: CookieItem[];
  storeName: string;
  freeDeliveryThreshold: number;
  businessHours: BusinessHourDayDTO[];
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("todos");
  const [cartOpen, setCartOpen] = useState(false);
  const [hoursStatus, setHoursStatus] = useState<BusinessHoursStatus | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Calculado no client (hora local do visitante convertida pro fuso da loja) de propósito,
    // pra não divergir do HTML gerado no servidor e causar mismatch de hidratação.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHoursStatus(getBusinessHoursStatus(businessHours));
  }, [businessHours]);

  const { cart, cartCount, cartTotal, delivery, orderTotal, addToCart, removeFromCart, deleteFromCart, clearCart } = useCart();

  const categories = useMemo(
    () => ["todos", ...Array.from(new Set(products.map((p) => p.category)))],
    [products]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter(
      (c) =>
        (category === "todos" || c.category === category) &&
        (c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
    );
  }, [products, search, category]);

  const getQty = (id: string) => cart.find((i) => i.id === id)?.quantity ?? 0;

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">

      {/* ── Pattern: soft-corner-vignette (neutral, page-wide) ──────────────── */}
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

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <a href="/" className="flex items-center gap-2 shrink-0" aria-label={storeName}>
            <Cookie
              className="w-5 h-5 transition-transform duration-500 hover:rotate-12"
              style={{ color: "var(--brand-sage)" }}
            />
            <span
              className="font-heading text-xl font-bold tracking-tight"
              style={{ color: "var(--brand-sage)" }}
            >
              {storeName}
            </span>
          </a>

          <div className="flex-1 max-w-lg mx-auto relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Buscar cookies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 pl-10 rounded-full bg-secondary border-0 text-sm focus-visible:ring-primary/40 transition-all"
            />
          </div>

          <button
            onClick={() => setCartOpen(true)}
            className="hidden sm:flex relative items-center gap-2 rounded-full border border-border px-4 h-10 hover:bg-secondary hover:border-primary/30 transition-all cursor-pointer"
            aria-label={`Carrinho com ${cartCount} itens`}
          >
            <ShoppingCart className="w-4 h-4 text-foreground" />
            <span className="font-heading text-sm font-semibold">
              Carrinho
            </span>
            {cartCount > 0 && (
              <Badge className="h-5 min-w-5 px-1.5 text-xs font-bold rounded-full absolute -top-1.5 -right-1.5 animate-badge-pop">
                {cartCount}
              </Badge>
            )}
          </button>
        </div>
      </header>

      {/* Floating cart button — mobile only */}
      <button
        onClick={() => setCartOpen(true)}
        className="sm:hidden fixed bottom-5 right-5 z-40 flex items-center justify-center w-14 h-14 rounded-full shadow-lg cursor-pointer active:scale-95 transition-transform"
        style={{ backgroundColor: "var(--brand-sage)" }}
        aria-label={`Carrinho com ${cartCount} itens`}
      >
        <ShoppingCart className="w-6 h-6 text-white" />
        {cartCount > 0 && (
          <Badge className="h-5 min-w-5 px-1.5 text-xs font-bold rounded-full absolute -top-1 -right-1 animate-badge-pop">
            {cartCount}
          </Badge>
        )}
      </button>

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

        {/* Floating cookie decorations */}
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
          🍫
        </span>

        {/* Logo Lolo Cookies — somente desktop */}
        <img
          aria-hidden
          src="/logo.png"
          alt=""
          className="pointer-events-none select-none absolute hidden sm:block sm:w-[320px] sm:right-[2%] sm:top-1/2 sm:-translate-y-1/2"
          style={{ mixBlendMode: "multiply", zIndex: 1 }}
        />

        <h1
          className="font-heading text-5xl sm:text-6xl lg:text-7xl font-black leading-none tracking-tight text-foreground animate-slide-up"
          style={{ animationDelay: "0s" }}
        >
          Nossos
          <br />
          <span style={{ color: "var(--brand-amber)" }}>Cookies.</span>
        </h1>

        <p
          className="mt-5 text-base sm:text-lg text-muted-foreground max-w-sm leading-relaxed animate-slide-up"
          style={{ animationDelay: "0.12s" }}
        >
          Feitos à mão, assados na hora e entregues direto pra você.
        </p>

        {hoursStatus?.hasAnyHours && (
          <div
            className="mt-4 flex items-center gap-1.5 text-sm animate-slide-up"
            style={{ animationDelay: "0.17s" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{
                backgroundColor: hoursStatus.isOpenNow ? "var(--brand-sage)" : "var(--muted-foreground)",
              }}
            />
            <span
              className="font-semibold"
              style={{ color: hoursStatus.isOpenNow ? "var(--brand-sage)" : "var(--muted-foreground)" }}
            >
              {hoursStatus.isOpenNow ? "Aberto agora" : "Fechado agora"}
            </span>
            {hoursStatus.todayShifts.length > 0 && (
              <span className="text-muted-foreground">
                · hoje {formatShiftsList(hoursStatus.todayShifts)}
              </span>
            )}
          </div>
        )}

        <div
          className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground animate-slide-up"
          style={{ animationDelay: "0.22s" }}
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" style={{ color: "var(--brand-amber)" }} />
            <span className="font-heading font-semibold text-foreground">
              {products.length}
            </span>{" "}
            sabores
          </span>
          <span className="w-px h-4 bg-border" />
          <span className="flex items-center gap-1.5">
            <Cookie className="w-3.5 h-3.5" style={{ color: "var(--brand-sage)" }} />
            Feito artesanal
          </span>
          <span className="w-px h-4 bg-border hidden sm:block" />
          <span className="hidden sm:block">Entrega grátis acima de {fmt(freeDeliveryThreshold)}</span>
        </div>
      </section>

      <section
        className="max-w-7xl mx-auto w-full px-4 sm:px-6 pb-8 animate-slide-up"
        style={{ animationDelay: "0.3s" }}
      >
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium capitalize transition-all duration-200 cursor-pointer
                ${
                  category === cat
                    ? "text-white shadow-sm scale-105"
                    : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-border"
                }
              `}
              style={category === cat ? { backgroundColor: "var(--brand-sage)" } : {}}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ── Cookie grid ─────────────────────────────────────────────────────── */}
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
              Nenhum cookie encontrado
            </h2>
            <p className="text-muted-foreground">Tente outro termo ou categoria.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                setCategory("todos");
              }}
              className="rounded-full mt-2"
            >
              Limpar filtros
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((cookie, index) => (
              <CookieCard
                key={cookie.id}
                cookie={cookie}
                quantity={getQty(cookie.id)}
                index={index}
                onAdd={() => addToCart(cookie)}
                onRemove={() => removeFromCart(cookie.id)}
              />
            ))}
          </div>
        )}
      </main>

      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent side="right" className="w-full sm:max-w-[420px] flex flex-col p-0 gap-0">
          <SheetHeader className="px-6 pt-6 pb-4">
            <SheetTitle className="font-heading text-2xl font-extrabold tracking-tight flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" style={{ color: "var(--brand-amber)" }} />
              Carrinho
              {cartCount > 0 && (
                <span className="font-sans text-sm font-normal text-muted-foreground ml-1">
                  ({cartCount} {cartCount === 1 ? "item" : "itens"})
                </span>
              )}
            </SheetTitle>
          </SheetHeader>

          <Separator />

          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
              <span className="text-6xl animate-pulse-soft select-none">🍪</span>
              <h3 className="font-heading text-xl font-bold text-foreground">
                Carrinho vazio
              </h3>
              <p className="text-sm text-muted-foreground">
                Adicione cookies do catálogo para começar.
              </p>
              <Button
                variant="outline"
                className="rounded-full mt-2"
                onClick={() => setCartOpen(false)}
              >
                Ver catálogo
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 px-6">
                <div className="divide-y divide-border">
                  {cart.map((entry) => (
                    <CartItemRow
                      key={entry.id}
                      entry={entry}
                      onAdd={() => addToCart(entry)}
                      onRemove={() => removeFromCart(entry.id)}
                      onDelete={() => deleteFromCart(entry.id)}
                    />
                  ))}
                </div>
              </ScrollArea>

              <div className="px-6 pb-6 pt-4 border-t border-border space-y-4 mt-auto">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      Subtotal ({cartCount} {cartCount === 1 ? "item" : "itens"})
                    </span>
                    <span>{fmt(cartTotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Entrega</span>
                    <span className="font-semibold" style={{ color: "var(--brand-sage)" }}>
                      {delivery === 0 ? "Grátis" : fmt(delivery)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-lg font-extrabold tracking-tight">
                      Total
                    </span>
                    <span
                      className="font-heading text-2xl font-black tracking-tight"
                      style={{ color: "var(--brand-amber)" }}
                    >
                      {fmt(orderTotal)}
                    </span>
                  </div>
                  {delivery > 0 && (
                    <p className="text-xs text-muted-foreground text-center pt-1">
                      Faltam{" "}
                      <span className="font-semibold text-foreground">
                        {fmt(freeDeliveryThreshold - cartTotal)}
                      </span>{" "}
                      para entrega grátis
                    </p>
                  )}
                </div>

                <Button
                  className="w-full h-12 rounded-full font-heading text-base font-bold gap-2 active:scale-[0.98] transition-transform"
                  onClick={() => { setCartOpen(false); router.push("/checkout"); }}
                >
                  Finalizar pedido
                  <ArrowRight className="w-4 h-4" />
                </Button>

                <button
                  onClick={clearCart}
                  className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer py-1"
                >
                  Limpar carrinho
                </button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
