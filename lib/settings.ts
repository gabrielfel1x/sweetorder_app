import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { StoreListItemDTO, StoreSettingsDTO } from "@/lib/types";

function mapStoreRow(row: {
  id: string;
  store_name: string;
  store_description: string;
  slug: string;
  email: string;
  whatsapp_number: string;
  whatsapp_message_template: string;
  free_delivery_threshold: number;
  delivery_fee: number;
  instagram_url: string;
  accepts_pix: boolean;
  pix_key: string;
  accepts_cash: boolean;
  accepts_card: boolean;
}): StoreSettingsDTO {
  return {
    id: row.id,
    storeName: row.store_name,
    storeDescription: row.store_description,
    slug: row.slug,
    email: row.email,
    whatsappNumber: row.whatsapp_number,
    whatsappMessageTemplate: row.whatsapp_message_template,
    freeDeliveryThreshold: row.free_delivery_threshold,
    deliveryFee: row.delivery_fee,
    instagramUrl: row.instagram_url,
    acceptsPix: row.accepts_pix,
    pixKey: row.pix_key,
    acceptsCash: row.accepts_cash,
    acceptsCard: row.accepts_card,
  };
}

export const getStoreBySlug = cache(async (slug: string): Promise<StoreSettingsDTO | null> => {
  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from("stores")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  if (!row) return null;

  return mapStoreRow(row);
});

export async function getStoreById(id: string): Promise<StoreSettingsDTO> {
  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from("stores")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return mapStoreRow(row);
}

export async function getAllStores(): Promise<StoreListItemDTO[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stores")
    .select("id, slug, store_name, store_description")
    .order("store_name", { ascending: true });

  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    slug: row.slug,
    storeName: row.store_name,
    storeDescription: row.store_description,
  }));
}
