"use client";

import { useState, useMemo } from "react";
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

// ─── Types ────────────────────────────────────────────────────────────────────

type CookieItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  visual: { bg: string; emoji: string };
};

type CartEntry = CookieItem & { quantity: number };

// ─── Data ─────────────────────────────────────────────────────────────────────

const COOKIES: CookieItem[] = [
  {
    id: 1,
    name: "Chocolate Chip Clássico",
    description: "Massa amanteigada com gotas de chocolate belga 70%",
    price: 12.9,
    category: "clássicos",
    visual: { bg: "#F2E0C4", emoji: "🍪" },
  },
  {
    id: 2,
    name: "Double Chocolate",
    description: "Massa de cacau intensa com recheio de ganache cremosa",
    price: 14.9,
    category: "chocolate",
    visual: { bg: "#3D1A08", emoji: "🍫" },
  },
  {
    id: 3,
    name: "Peanut Butter",
    description: "Cremoso e irresistível com amendoim torrado e flor de sal",
    price: 13.9,
    category: "clássicos",
    visual: { bg: "#D4A84B", emoji: "🥜" },
  },
  {
    id: 4,
    name: "Matcha White Choco",
    description: "Matcha japonês premium com gotas de chocolate branco",
    price: 16.9,
    category: "especiais",
    visual: { bg: "#4A7C59", emoji: "🍵" },
  },
  {
    id: 5,
    name: "Lemon Blueberry",
    description: "Cítrico e leve com mirtilo fresco e cobertura de açúcar",
    price: 15.9,
    category: "especiais",
    visual: { bg: "#3D5A9A", emoji: "🫐" },
  },
  {
    id: 6,
    name: "Nutella Stuffed",
    description: "Cookie recheado com Nutella derretendo no centro",
    price: 17.9,
    category: "chocolate",
    visual: { bg: "#6B3A2A", emoji: "🌰" },
  },
  {
    id: 7,
    name: "Coconut Sem Glúten",
    description: "Farinha de amêndoa com coco ralado e baunilha",
    price: 14.9,
    category: "sem glúten",
    visual: { bg: "#E8D5A3", emoji: "🥥" },
  },
  {
    id: 8,
    name: "Oatmeal & Raisin",
    description: "Aveia crocante com uvas-passas e canela em pó",
    price: 12.9,
    category: "clássicos",
    visual: { bg: "#C8A96E", emoji: "🌾" },
  },
  {
    id: 9,
    name: "Red Velvet",
    description: "Textura aveludada com recheio de cream cheese artesanal",
    price: 16.9,
    category: "especiais",
    visual: { bg: "#8B1A1A", emoji: "❤️" },
  },
];

const CATEGORIES = [
  "todos",
  "clássicos",
  "chocolate",
  "especiais",
  "sem glúten",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// ─── Cookie Card ──────────────────────────────────────────────────────────────

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
      {/* Visual placeholder */}
      <div
        className="relative aspect-square flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: cookie.visual.bg }}
      >
        <span
          className="text-7xl select-none transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-[-8deg] drop-shadow-md"
        >
          {cookie.visual.emoji}
        </span>

        {/* Shine overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Price badge on corner */}
        {quantity > 0 && (
          <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-heading font-bold px-2.5 py-1 rounded-full shadow-md">
            {quantity}× no carrinho
          </div>
        )}
      </div>

      {/* Info */}
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
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-border transition-colors active:scale-90"
                aria-label="Remover um"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-heading text-base font-bold w-5 text-center select-none tabular-nums">
                {quantity}
              </span>
              <button
                onClick={onAdd}
                className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-all active:scale-90"
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

// ─── Cart Item Row ─────────────────────────────────────────────────────────────

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
            className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors active:scale-90"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="font-heading text-base font-bold w-4 text-center tabular-nums">
            {entry.quantity}
          </span>
          <button
            onClick={onAdd}
            className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-all active:scale-90"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      <button
        onClick={onDelete}
        className="self-start mt-1 w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-secondary transition-colors flex-shrink-0"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

// ─── Main Catalog ─────────────────────────────────────────────────────────────

export function Catalog() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("todos");
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return COOKIES.filter(
      (c) =>
        (category === "todos" || c.category === category) &&
        (c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q))
    );
  }, [search, category]);

  const getQty = (id: number) =>
    cart.find((i) => i.id === id)?.quantity ?? 0;

  const addToCart = (cookie: CookieItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === cookie.id);
      if (existing)
        return prev.map((i) =>
          i.id === cookie.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      return [...prev, { ...cookie, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (!existing) return prev;
      if (existing.quantity === 1) return prev.filter((i) => i.id !== id);
      return prev.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  };

  const deleteFromCart = (id: number) =>
    setCart((prev) => prev.filter((i) => i.id !== id));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          {/* Brand */}
          <a
            href="/"
            className="flex items-center gap-2 shrink-0"
            aria-label="SweetOrder"
          >
            <Cookie
              className="w-5 h-5 transition-transform duration-500 hover:rotate-12"
              style={{ color: "var(--brand-sage)" }}
            />
            <span
              className="font-heading text-xl font-bold tracking-tight hidden sm:block"
              style={{ color: "var(--brand-sage)" }}
            >
              SweetOrder
            </span>
          </a>

          {/* Search */}
          <div className="flex-1 max-w-lg mx-auto relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Buscar cookies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-full bg-secondary border-0 text-sm focus-visible:ring-primary/40 transition-all"
            />
          </div>

          {/* Cart button */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 rounded-full border border-border px-4 h-10 hover:bg-secondary hover:border-primary/30 transition-all"
            aria-label={`Carrinho com ${cartCount} itens`}
          >
            <ShoppingCart className="w-4 h-4 text-foreground" />
            <span className="font-heading text-sm font-semibold hidden sm:block">
              Carrinho
            </span>
            {cartCount > 0 && (
              <Badge
                key={`badge-${cartCount}`}
                className="h-5 min-w-5 px-1.5 text-xs font-bold rounded-full absolute -top-1.5 -right-1.5 animate-badge-pop"
              >
                {cartCount}
              </Badge>
            )}
          </button>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 pt-14 pb-10 overflow-hidden">
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

        {/* Stats strip */}
        <div
          className="mt-8 flex items-center gap-6 text-sm text-muted-foreground animate-slide-up"
          style={{ animationDelay: "0.22s" }}
        >
          <span className="flex items-center gap-1.5">
            <Sparkles
              className="w-3.5 h-3.5"
              style={{ color: "var(--brand-amber)" }}
            />
            <span className="font-heading font-semibold text-foreground">
              {COOKIES.length}
            </span>{" "}
            sabores
          </span>
          <span className="w-px h-4 bg-border" />
          <span className="flex items-center gap-1.5">
            <Cookie
              className="w-3.5 h-3.5"
              style={{ color: "var(--brand-sage)" }}
            />
            Feito artesanal
          </span>
          <span className="w-px h-4 bg-border hidden sm:block" />
          <span className="hidden sm:block">Entrega grátis acima de R$ 50</span>
        </div>
      </section>

      {/* ── Category filters ─────────────────────────────────────────────────── */}
      <section
        className="max-w-7xl mx-auto w-full px-4 sm:px-6 pb-8 animate-slide-up"
        style={{ animationDelay: "0.3s" }}
      >
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium capitalize transition-all duration-200
                ${
                  category === cat
                    ? "text-white shadow-sm scale-105"
                    : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-border"
                }
              `}
              style={
                category === cat
                  ? { backgroundColor: "var(--brand-sage)" }
                  : {}
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ── Cookie grid ─────────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 pb-16">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <span className="text-6xl animate-pulse-soft select-none">🍪</span>
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Nenhum cookie encontrado
            </h2>
            <p className="text-muted-foreground">
              Tente outro termo ou categoria.
            </p>
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

      {/* ── Cart Sheet ──────────────────────────────────────────────────────── */}
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-[420px] flex flex-col p-0 gap-0"
        >
          <SheetHeader className="px-6 pt-6 pb-4">
            <SheetTitle className="font-heading text-2xl font-extrabold tracking-tight flex items-center gap-2">
              <ShoppingCart
                className="w-5 h-5"
                style={{ color: "var(--brand-amber)" }}
              />
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
                    <span
                      className="font-semibold"
                      style={{ color: "var(--brand-sage)" }}
                    >
                      {cartTotal >= 50 ? "Grátis" : fmt(8.9)}
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
                      {fmt(cartTotal >= 50 ? cartTotal : cartTotal + 8.9)}
                    </span>
                  </div>
                  {cartTotal < 50 && (
                    <p className="text-xs text-muted-foreground text-center pt-1">
                      Faltam{" "}
                      <span className="font-semibold text-foreground">
                        {fmt(50 - cartTotal)}
                      </span>{" "}
                      para entrega grátis
                    </p>
                  )}
                </div>

                <Button className="w-full h-12 rounded-full font-heading text-base font-bold gap-2 active:scale-[0.98] transition-transform">
                  Finalizar pedido
                  <ArrowRight className="w-4 h-4" />
                </Button>

                <button
                  onClick={() => setCart([])}
                  className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
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
