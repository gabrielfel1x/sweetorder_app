"use server";

import {
  findCustomerByPhone,
  upsertCustomer,
  saveCustomerAddress,
  type CustomerLookupResult,
  type NewAddressInput,
} from "@/lib/customers";
import {
  createOrder,
  decrementProductsStock,
  findOrdersByPhone,
  type OrderDTO,
  type OrderItemSnapshot,
  type OrderAddressSnapshot,
} from "@/lib/orders";
import { customerIdentitySchema } from "@/lib/schemas/customer";
import { getBusinessHours } from "@/lib/business-hours";
import { getBusinessHoursStatus } from "@/lib/business-hours-status";
import { getStoreById } from "@/lib/settings";

export async function lookupCustomerAction(
  storeId: string,
  phone: string
): Promise<CustomerLookupResult | null> {
  const parsed = customerPhoneOnly(phone);
  if (!parsed) return null;
  try {
    return await findCustomerByPhone(storeId, parsed);
  } catch {
    // Falha na busca (ex: erro transitório) não deve travar o checkout —
    // segue como se fosse um cliente novo.
    return null;
  }
}

function parseIdentity(name: string, phone: string) {
  const parsed = customerIdentitySchema.safeParse({ name, phone });
  return parsed.success ? parsed.data : null;
}

function customerPhoneOnly(phone: string): string | null {
  const parsed = customerIdentitySchema.shape.phone.safeParse(phone);
  return parsed.success ? parsed.data : null;
}

export async function submitOrderAction(params: {
  storeId: string;
  name: string;
  phone: string;
  address: OrderAddressSnapshot;
  saveNewAddress?: NewAddressInput;
  items: OrderItemSnapshot[];
  stockItems: { productId: string; quantity: number }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  paymentNote?: string;
}): Promise<{ ok: boolean; reason?: "closed" | "invalid" | "out_of_stock" }> {
  const identity = parseIdentity(params.name, params.phone);
  if (!identity || params.items.length === 0) return { ok: false, reason: "invalid" };

  const [businessHours, store] = await Promise.all([
    getBusinessHours(params.storeId),
    getStoreById(params.storeId),
  ]);
  const hoursStatus = getBusinessHoursStatus(businessHours, store.manuallyClosedDate);
  if (hoursStatus.isManuallyClosedToday || (hoursStatus.hasAnyHours && !hoursStatus.isOpenNow)) {
    return { ok: false, reason: "closed" };
  }

  const stockResult = await decrementProductsStock(params.stockItems);
  if (!stockResult.ok) return { ok: false, reason: "out_of_stock" };

  try {
    const customerId = await upsertCustomer({
      storeId: params.storeId,
      name: identity.name,
      phone: identity.phone,
    });

    if (params.saveNewAddress) {
      await saveCustomerAddress(customerId, params.saveNewAddress);
    }

    await createOrder({
      storeId: params.storeId,
      customerId,
      items: params.items,
      address: params.address,
      subtotal: params.subtotal,
      deliveryFee: params.deliveryFee,
      total: params.total,
      paymentMethod: params.paymentMethod,
      paymentNote: params.paymentNote,
    });

    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export async function lookupOrdersAction(storeId: string, phone: string): Promise<OrderDTO[]> {
  const parsed = customerPhoneOnly(phone);
  if (!parsed) return [];
  try {
    return await findOrdersByPhone(storeId, parsed);
  } catch {
    return [];
  }
}
