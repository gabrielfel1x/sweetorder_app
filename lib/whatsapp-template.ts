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

export const DEFAULT_WHATSAPP_TEMPLATE = `*Novo Pedido: {{loja}}*

*Itens do pedido:*
{{itens}}

*Subtotal:* {{subtotal}}
*Taxa de entrega:* {{entrega}}
*Total: {{total}}*

*Pagamento:* {{pagamento}}

*Endereço de entrega:*
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

/**
 * Alguns navegadores/apps mobile truncam a URL do link `wa.me` num limite de
 * tamanho não documentado. Se o corte cair no meio da sequência percent-encoded
 * de um emoji (multi-byte em UTF-8), o WhatsApp renderiza o glyph "tofu"
 * (losango com interrogação) — daí o bug intermitente só em pedidos grandes.
 * Truncamos sempre por code point inteiro (nunca no meio de um emoji) para
 * a mensagem final nunca ultrapassar um limite seguro.
 */
export function truncateWhatsAppMessage(message: string, maxEncodedLength = 1900): string {
  if (encodeURIComponent(message).length <= maxEncodedLength) return message;

  const suffix = "\n\n[mensagem truncada, detalhes completos no pedido salvo]";
  const suffixEncodedLength = encodeURIComponent(suffix).length;

  let result = "";
  let encodedLength = 0;
  for (const char of message) {
    const charEncodedLength = encodeURIComponent(char).length;
    if (encodedLength + charEncodedLength + suffixEncodedLength > maxEncodedLength) break;
    result += char;
    encodedLength += charEncodedLength;
  }
  return result + suffix;
}
