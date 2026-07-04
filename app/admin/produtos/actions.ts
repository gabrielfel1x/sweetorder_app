"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session-helpers";

const productSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório"),
  description: z.string().trim().min(1, "Descrição é obrigatória"),
  price: z.coerce.number().positive("Preço deve ser maior que zero"),
  category: z.string().trim().min(1, "Categoria é obrigatória"),
  visualBg: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, "Cor inválida (use um hex, ex: #F2E0C4)"),
  visualEmoji: z.string().trim().min(1, "Emoji é obrigatório").max(4, "Use apenas 1 emoji"),
});

export type ProductInput = z.infer<typeof productSchema>;
export type ProductActionState = { error?: string };

function revalidateProductPaths() {
  revalidatePath("/admin/produtos");
  revalidatePath("/");
}

export async function createProduct(data: ProductInput): Promise<ProductActionState> {
  await requireAdmin();
  const parsed = productSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const last = await prisma.product.findFirst({ orderBy: { sortOrder: "desc" } });
  await prisma.product.create({
    data: { ...parsed.data, sortOrder: (last?.sortOrder ?? 0) + 1 },
  });

  revalidateProductPaths();
  return {};
}

export async function updateProduct(id: string, data: ProductInput): Promise<ProductActionState> {
  await requireAdmin();
  const parsed = productSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  await prisma.product.update({ where: { id }, data: parsed.data });
  revalidateProductPaths();
  return {};
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id } });
  revalidateProductPaths();
}

export async function toggleProductActive(id: string, active: boolean) {
  await requireAdmin();
  await prisma.product.update({ where: { id }, data: { active } });
  revalidateProductPaths();
}
