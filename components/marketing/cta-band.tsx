import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CtaBand() {
  return (
    <section className="py-16 md:py-20 px-4 sm:px-6" style={{ backgroundColor: "var(--brand-sage)" }}>
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-heading text-3xl sm:text-4xl font-black tracking-tight text-white">
          Pronto pra vender mais organizado?
        </h2>
        <p className="mt-3 text-white/85 max-w-xl mx-auto">
          Crie sua loja agora e comece a receber pedidos direto no seu WhatsApp.
        </p>
        <Link
          href="/cadastro"
          className="group mt-7 inline-flex items-center gap-2 h-14 px-8 rounded-full font-heading font-black bg-white transition-transform active:scale-95"
          style={{ color: "var(--brand-sage)" }}
        >
          Criar minha loja
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
