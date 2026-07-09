import { z } from "zod";
import { slugSchema } from "@/lib/schemas/store-settings";

export const signUpSchema = z.object({
  name: z.string().trim().min(1, "Seu nome é obrigatório").max(80, "Nome muito longo"),
  email: z.string().trim().min(1, "E-mail é obrigatório").email("E-mail inválido"),
  password: z.string().min(6, "A senha precisa ter ao menos 6 caracteres"),
  storeName: z.string().trim().min(1, "Nome da loja é obrigatório").max(80, "Nome da loja muito longo"),
  slug: slugSchema,
});

export type SignUpFormData = z.infer<typeof signUpSchema>;

export const createStoreSchema = z.object({
  storeName: z.string().trim().min(1, "Nome da loja é obrigatório").max(80, "Nome da loja muito longo"),
  slug: slugSchema,
});

export type CreateStoreFormData = z.infer<typeof createStoreSchema>;
