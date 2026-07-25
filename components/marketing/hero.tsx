"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Rocket } from "lucide-react";

const ROTATING_WORDS = ["docinhos", "perfumes", "flores", "presentes", "salgados"];

const TRUST_POINTS = [
  "Sem precisar de site próprio",
  "Pedidos direto no seu WhatsApp",
  "Painel simples de configurar",
];

function RotatingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % ROTATING_WORDS.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="relative inline-grid" style={{ color: "var(--brand-sage)" }}>
      <span
        key={index}
        className="animate-slide-up col-start-1 row-start-1 whitespace-nowrap"
      >
        {ROTATING_WORDS[index]}
      </span>
      <span aria-hidden className="invisible col-start-1 row-start-1 whitespace-nowrap">
        {ROTATING_WORDS.reduce((a, b) => (a.length > b.length ? a : b))}
      </span>
    </span>
  );
}

export function Hero({ publishedCount }: { publishedCount: number }) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle 700px at 15% 0%, color-mix(in oklch, var(--brand-sage) 10%, transparent), transparent),
            radial-gradient(circle 600px at 100% 200px, color-mix(in oklch, var(--brand-amber) 10%, transparent), transparent)
          `,
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-14 pb-16 md:pt-20 md:pb-24 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold text-muted-foreground mb-6">
          <Rocket className="w-3.5 h-3.5" style={{ color: "var(--brand-sage)" }} />
          Feito pra loja artesanal vender mais
        </span>

        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08]">
          Sua loja de <RotatingWord /> pronta pra vender em minutos
        </h1>

        <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Catálogo online, pedidos direto no seu WhatsApp e entrega configurada do seu jeito,
          tudo em um painel simples, feito pra loja artesanal crescer.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/cadastro"
            className="group inline-flex items-center gap-2 h-14 px-8 rounded-full font-heading font-black text-white transition-transform active:scale-95"
            style={{ backgroundColor: "var(--brand-sage)" }}
          >
            Criar minha loja
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="#lojas"
            className="inline-flex items-center h-14 px-8 rounded-full font-heading font-bold border-2 border-border hover:border-foreground transition-colors"
          >
            Ver lojas na plataforma
          </a>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {TRUST_POINTS.map((point) => (
            <span key={point} className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Check className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--brand-sage)" }} />
              {point}
            </span>
          ))}
        </div>

        {publishedCount >= 3 && (
          <p className="mt-6 text-sm text-muted-foreground">
            {publishedCount} lojas já vendendo pela plataforma
          </p>
        )}
      </div>
    </section>
  );
}
