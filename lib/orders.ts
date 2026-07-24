import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export type OrderItemSnapshot = {
  name: string;
  quantity: number;
  unitPrice: number;
};

export type OrderAddressSnapshot = {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
};

export type OrderDTO = {
  id: string;
  items: OrderItemSnapshot[];
  address: OrderAddressSnapshot | null;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  paymentNote: string | null;
  createdAt: string;
};

export async function createOrder(params: {
  storeId: string;
  customerId: string;
  items: OrderItemSnapshot[];
  address?: OrderAddressSnapshot;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  paymentNote?: string;
}): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin.from("orders").insert({
    store_id: params.storeId,
    customer_id: params.customerId,
    items: params.items,
    address: params.address ?? null,
    subtotal: params.subtotal,
    delivery_fee: params.deliveryFee,
    total: params.total,
    payment_method: params.paymentMethod,
    payment_note: params.paymentNote ?? null,
  });
  if (error) throw error;
}

export async function decrementProductsStock(
  items: { productId: string; quantity: number }[]
): Promise<{ ok: true } | { ok: false }> {
  const admin = createAdminClient();
  const { error } = await admin.rpc("decrement_products_stock", {
    p_items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
  });
  if (error) return { ok: false };
  return { ok: true };
}

export async function findOrdersByPhone(storeId: string, phone: string): Promise<OrderDTO[]> {
  const admin = createAdminClient();

  const { data: customer, error: customerError } = await admin
    .from("customers")
    .select("id")
    .eq("store_id", storeId)
    .eq("phone", phone)
    .maybeSingle();
  if (customerError) throw customerError;
  if (!customer) return [];

  const { data: orders, error: ordersError } = await admin
    .from("orders")
    .select(
      "id, items, address, subtotal, delivery_fee, total, payment_method, payment_note, created_at"
    )
    .eq("customer_id", customer.id)
    .order("created_at", { ascending: false });
  if (ordersError) throw ordersError;

  return (orders ?? []).map((row) => ({
    id: row.id,
    items: row.items,
    address: row.address,
    subtotal: row.subtotal,
    deliveryFee: row.delivery_fee,
    total: row.total,
    paymentMethod: row.payment_method,
    paymentNote: row.payment_note,
    createdAt: row.created_at,
  }));
}
