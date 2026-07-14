import { z } from "zod";
import { slugSchema } from "@/lib/schemas/store-settings";

export const inviteClientSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório").max(80, "Nome muito longo"),
  email: z.string().trim().min(1, "E-mail é obrigatório").email("E-mail inválido"),
  storeName: z.string().trim().min(1, "Nome da loja é obrigatório").max(80, "Nome da loja muito longo"),
  slug: slugSchema,
});

export type InviteClientFormData = z.infer<typeof inviteClientSchema>;
