import { z } from "zod";

export const customerPhoneSchema = z
  .string()
  .trim()
  .regex(/^\d{10,11}$/, "Telefone deve ter 10 ou 11 dígitos (com DDD)");

export const customerIdentitySchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório").max(80, "Nome muito longo"),
  phone: customerPhoneSchema,
});

export type CustomerIdentityFormData = z.infer<typeof customerIdentitySchema>;
