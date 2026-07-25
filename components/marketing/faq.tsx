import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "Preciso saber programar pra usar?",
    answer:
      "Não. Você cadastra os produtos, define entrega e formas de pagamento direto no painel administrativo, sem precisar mexer em código.",
  },
  {
    question: "Como eu recebo os pedidos?",
    answer:
      "Cada pedido feito no catálogo chega pronto, formatado, direto no seu WhatsApp, você fecha a venda por lá, do seu jeito.",
  },
  {
    question: "Posso vender só com retirada, sem entrega?",
    answer:
      "Sim. Você decide se oferece entrega, retirada ou os dois, e configura a taxa e o valor mínimo pra frete grátis.",
  },
  {
    question: "Dá pra pausar a loja num dia específico?",
    answer:
      "Sim, direto do painel: um clique fecha a loja pro dia, sem precisar mexer no horário de funcionamento cadastrado.",
  },
  {
    question: "Posso personalizar a cara da minha loja?",
    answer:
      "Sim, escolha o ícone, a cor e a logo da sua loja, que aparecem no catálogo público que seus clientes acessam.",
  },
];

export function Faq() {
  return (
    <section id="perguntas" className="max-w-3xl mx-auto px-4 sm:px-6 py-16 md:py-24">
      <div className="text-center mb-10">
        <span
          className="text-xs font-bold uppercase tracking-wide"
          style={{ color: "var(--brand-sage)" }}
        >
          Perguntas frequentes
        </span>
        <h2 className="mt-2 font-heading text-3xl sm:text-4xl font-black tracking-tight">
          Ainda com dúvidas?
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        {FAQ_ITEMS.map((item) => (
          <details
            key={item.question}
            className="group rounded-2xl border-2 border-border bg-card px-5 open:border-foreground transition-colors"
          >
            <summary className="flex items-center justify-between gap-4 py-4 cursor-pointer list-none font-heading font-bold">
              {item.question}
              <ChevronDown className="w-4 h-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
            </summary>
            <p className="pb-4 text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
