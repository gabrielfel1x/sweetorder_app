import {
  Clock,
  CreditCard,
  MessageCircle,
  Package,
  Palette,
  PowerOff,
  Store,
  Truck,
  Wallet,
  type LucideIcon,
} from "lucide-react";

type BigFeature = {
  icon: LucideIcon;
  badge: string;
  title: string;
  description: string;
  accent: string;
};

const BIG_FEATURES: BigFeature[] = [
  {
    icon: Package,
    badge: "Catálogo",
    title: "Catálogo completo",
    description:
      "Cadastre produtos com fotos, categorias e controle de estoque. Ative ou pause itens quando quiser.",
    accent: "var(--brand-sage)",
  },
  {
    icon: MessageCircle,
    badge: "WhatsApp",
    title: "Pedidos no WhatsApp",
    description:
      "Cada pedido chega pronto pro fechamento, com mensagem automática direto pro seu número.",
    accent: "var(--brand-amber)",
  },
  {
    icon: Truck,
    badge: "Entrega",
    title: "Entrega do seu jeito",
    description:
      "Defina taxa por região, frete grátis a partir de um valor, ou deixe a loja só para retirada.",
    accent: "var(--brand-sage)",
  },
];

type SmallFeature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const SMALL_FEATURES: SmallFeature[] = [
  {
    icon: Palette,
    title: "Sua marca",
    description: "Ícone e cor personalizados no catálogo público da sua loja.",
  },
  {
    icon: Clock,
    title: "Horário sob controle",
    description: "Configure os dias e turnos de funcionamento da sua loja.",
  },
  {
    icon: PowerOff,
    title: "Fechamento pontual",
    description: "Feche a loja num clique quando precisar, sem mexer no horário fixo.",
  },
  {
    icon: Wallet,
    title: "Pix, cartão e dinheiro",
    description: "Aceite as formas de pagamento que fizerem sentido pro seu negócio.",
  },
  {
    icon: CreditCard,
    title: "Parcelamento no cartão",
    description: "Configure preço diferenciado no cartão, parcelado em até 3x.",
  },
  {
    icon: Store,
    title: "Catálogo público",
    description: "Sua loja ganha uma página própria pra compartilhar com seus clientes.",
  },
];

export function Features() {
  return (
    <section id="recursos" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <span
          className="text-xs font-bold uppercase tracking-wide"
          style={{ color: "var(--brand-sage)" }}
        >
          Recursos
        </span>
        <h2 className="mt-2 font-heading text-3xl sm:text-4xl font-black tracking-tight">
          Tudo que sua loja precisa, num só lugar
        </h2>
        <p className="mt-3 text-muted-foreground">
          Configure sua vitrine, receba pedidos e entregue do seu jeito, sem depender de
          várias ferramentas soltas.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {BIG_FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lg"
          >
            <div className="flex items-center gap-3 mb-4">
              <span
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `color-mix(in oklch, ${feature.accent} 14%, var(--card))` }}
              >
                <feature.icon className="w-5 h-5" style={{ color: feature.accent }} />
              </span>
              <span
                className="rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide"
                style={{
                  backgroundColor: `color-mix(in oklch, ${feature.accent} 12%, var(--card))`,
                  color: feature.accent,
                }}
              >
                {feature.badge}
              </span>
            </div>
            <h3 className="font-heading text-lg font-bold">{feature.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 lg:grid-cols-3 gap-4">
        {SMALL_FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="flex flex-col gap-2 p-5 rounded-2xl border-2 border-border transition-colors hover:border-foreground"
          >
            <feature.icon className="w-5 h-5" style={{ color: "var(--brand-sage)" }} />
            <h3 className="font-heading font-bold text-sm">{feature.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
