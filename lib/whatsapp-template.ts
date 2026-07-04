export const ALLOWED_WHATSAPP_PLACEHOLDERS = [
  "loja",
  "itens",
  "subtotal",
  "entrega",
  "total",
  "pagamento",
  "endereco",
] as const;

export type WhatsAppPlaceholder = (typeof ALLOWED_WHATSAPP_PLACEHOLDERS)[number];

export const DEFAULT_WHATSAPP_TEMPLATE = `🍪 *Novo Pedido — {{loja}}*

*Itens do pedido:*
{{itens}}

*Subtotal:* {{subtotal}}
*Taxa de entrega:* {{entrega}}
*💰 Total: {{total}}*

*Pagamento:* {{pagamento}}

*📍 Endereço de entrega:*
{{endereco}}`;

export function extractWhatsAppPlaceholders(template: string): string[] {
  const matches = template.matchAll(/\{\{\s*([a-zA-Z]+)\s*\}\}/g);
  return Array.from(matches, (m) => m[1]);
}

export function renderWhatsAppTemplate(
  template: string,
  vars: Record<WhatsAppPlaceholder, string>
): string {
  return template.replace(/\{\{\s*([a-zA-Z]+)\s*\}\}/g, (match, key: string) => {
    return key in vars ? vars[key as WhatsAppPlaceholder] : match;
  });
}
