"use server";

import {
  findCustomerByPhone,
  saveCustomerOrder,
  type CustomerLookupResult,
  type NewAddressInput,
} from "@/lib/customers";
import { customerIdentitySchema } from "@/lib/schemas/customer";

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

export async function saveCustomerOrderAction(params: {
  storeId: string;
  name: string;
  phone: string;
  addressId?: string;
  newAddress?: NewAddressInput;
}): Promise<{ ok: boolean }> {
  const identity = parseIdentity(params.name, params.phone);
  if (!identity) return { ok: false };

  try {
    await saveCustomerOrder({
      storeId: params.storeId,
      name: identity.name,
      phone: identity.phone,
      addressId: params.addressId,
      newAddress: params.newAddress,
    });
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
