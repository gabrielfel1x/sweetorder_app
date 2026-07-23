import { createClient } from "@/lib/supabase/server";
import type { ProductAdminDTO, ProductDTO } from "@/lib/types";

export async function getActiveProducts(storeId: string): Promise<ProductDTO[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("store_id", storeId)
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;

  return data.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    category: p.category,
    visual: { bg: p.visual_bg, emoji: p.visual_emoji },
    imageUrl: p.image_url,
    cardPrice: p.card_price,
    installments: p.installments,
  }));
}

export async function getAllProductsForAdmin(storeId: string): Promise<ProductAdminDTO[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("store_id", storeId)
    .order("sort_order", { ascending: true });

  if (error) throw error;

  return data.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    category: p.category,
    visual: { bg: p.visual_bg, emoji: p.visual_emoji },
    imageUrl: p.image_url,
    cardPrice: p.card_price,
    installments: p.installments,
    active: p.active,
    sortOrder: p.sort_order,
  }));
}
