import Link from "next/link";
import { Clock } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5" strokeWidth={2.75} style={{ color: "var(--brand-sage)" }} />
          <span className="font-heading font-bold text-sm">PedeNaHora</span>
          <span className="text-sm text-muted-foreground hidden sm:inline">
            • catálogo online pra loja artesanal vender mais.
          </span>
        </div>

        <div className="flex items-center gap-6 text-sm font-semibold text-muted-foreground">
          <a href="#recursos" className="hover:text-foreground transition-colors">
            Recursos
          </a>
          <a href="#lojas" className="hover:text-foreground transition-colors">
            Lojas
          </a>
          <Link href="/login" className="hover:text-foreground transition-colors">
            Entrar
          </Link>
        </div>
      </div>

      <div className="border-t border-border">
        <p className="max-w-7xl mx-auto px-4 sm:px-6 py-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} PedeNaHora. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
