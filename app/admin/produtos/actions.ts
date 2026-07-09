"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
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
  revalidatePath("/[slug]", "layout");
}

export async function createProduct(data: ProductInput): Promise<ProductActionState> {
  const admin = await requireAdmin();
  const parsed = productSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const supabase = await createClient();
  const { data: last } = await supabase
    .from("products")
    .select("sort_order")
    .eq("store_id", admin.storeId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("products").insert({
    store_id: admin.storeId,
    name: parsed.data.name,
    description: parsed.data.description,
    price: parsed.data.price,
    category: parsed.data.category,
    visual_bg: parsed.data.visualBg,
    visual_emoji: parsed.data.visualEmoji,
    sort_order: (last?.sort_order ?? 0) + 1,
  });
  if (error) return { error: "Erro ao criar produto" };

  revalidateProductPaths();
  return {};
}

export async function updateProduct(id: string, data: ProductInput): Promise<ProductActionState> {
  const admin = await requireAdmin();
  const parsed = productSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({
      name: parsed.data.name,
      description: parsed.data.description,
      price: parsed.data.price,
      category: parsed.data.category,
      visual_bg: parsed.data.visualBg,
      visual_emoji: parsed.data.visualEmoji,
    })
    .eq("id", id)
    .eq("store_id", admin.storeId);
  if (error) return { error: "Erro ao atualizar produto" };

  revalidateProductPaths();
  return {};
}

export async function deleteProduct(id: string) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  await supabase.from("products").delete().eq("id", id).eq("store_id", admin.storeId);
  revalidateProductPaths();
}

export async function toggleProductActive(id: string, active: boolean) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  await supabase.from("products").update({ active }).eq("id", id).eq("store_id", admin.storeId);
  revalidateProductPaths();
}
