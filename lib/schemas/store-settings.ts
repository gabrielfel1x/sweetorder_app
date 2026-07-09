import { z } from "zod";
import { ALLOWED_WHATSAPP_PLACEHOLDERS, extractWhatsAppPlaceholders } from "@/lib/whatsapp-template";

export const RESERVED_SLUGS = ["admin", "login", "cadastro", "api", "_next"];

export const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "O slug precisa ter ao menos 3 caracteres")
  .max(40, "O slug pode ter no máximo 40 caracteres")
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use apenas letras minúsculas, números e hífen (sem espaços)")
  .refine((slug) => !RESERVED_SLUGS.includes(slug), "Esse slug é reservado, escolha outro");

export const storeSettingsSchema = z.object({
  storeName: z.string().trim().min(1, "Nome da loja é obrigatório").max(80, "Nome da loja muito longo"),
  storeDescription: z.string().trim().min(1, "Descrição é obrigatória").max(280, "Descrição muito longa"),
  slug: slugSchema,
  email: z.string().trim().min(1, "E-mail é obrigatório").email("E-mail inválido"),
  whatsappNumber: z
    .string()
    .trim()
    .regex(/^\d{12,13}$/, "Use o formato 55DDDNNNNNNNNN, só dígitos"),
  whatsappMessageTemplate: z
    .string()
    .trim()
    .min(1, "A mensagem não pode ficar vazia")
    .refine((template) => {
      const used = extractWhatsAppPlaceholders(template);
      return used.every((token) => (ALLOWED_WHATSAPP_PLACEHOLDERS as readonly string[]).includes(token));
    }, `Use apenas os placeholders disponíveis: ${ALLOWED_WHATSAPP_PLACEHOLDERS.map((p) => `{{${p}}}`).join(", ")}`),
  instagramUrl: z.string().trim().url("URL inválida").or(z.literal("")),
  freeDeliveryThreshold: z.number({ error: "Informe um valor válido" }).nonnegative("Valor inválido"),
  deliveryFee: z.number({ error: "Informe um valor válido" }).nonnegative("Valor inválido"),
  acceptsPix: z.boolean(),
  pixKey: z.string().trim(),
  acceptsCash: z.boolean(),
  acceptsCard: z.boolean(),
});

export type StoreSettingsFormData = z.infer<typeof storeSettingsSchema>;
