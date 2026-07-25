"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "#recursos", label: "Recursos" },
  { href: "#lojas", label: "Lojas" },
  { href: "#perguntas", label: "Perguntas" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Clock className="w-6 h-6" strokeWidth={2.75} style={{ color: "var(--brand-sage)" }} />
          <span className="font-heading text-lg font-bold tracking-tight">PedeNaHora</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3 shrink-0">
          <Link
            href="/login"
            className="inline-flex items-center h-10 px-5 rounded-full text-sm font-bold text-white transition-transform active:scale-95"
            style={{ backgroundColor: "var(--brand-sage)" }}
          >
            Entrar na minha loja
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center border-2 border-border cursor-pointer"
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
        >
          {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 sm:px-6 py-4 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="py-2.5 text-sm font-semibold text-foreground"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-2 flex flex-col gap-2">
            <Link
              href="/login"
              className="h-11 rounded-xl flex items-center justify-center text-sm font-bold text-white"
              style={{ backgroundColor: "var(--brand-sage)" }}
            >
              Entrar na minha loja
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
