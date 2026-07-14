import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export type CustomerAddressDTO = {
  id: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
};

export type CustomerLookupResult = {
  id: string;
  name: string;
  addresses: CustomerAddressDTO[];
};

function mapAddressRow(row: {
  id: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}): CustomerAddressDTO {
  return {
    id: row.id,
    cep: row.cep,
    street: row.street,
    number: row.number,
    complement: row.complement,
    neighborhood: row.neighborhood,
    city: row.city,
    state: row.state,
  };
}

export async function findCustomerByPhone(
  storeId: string,
  phone: string
): Promise<CustomerLookupResult | null> {
  const admin = createAdminClient();

  const { data: customer, error: customerError } = await admin
    .from("customers")
    .select("id, name")
    .eq("store_id", storeId)
    .eq("phone", phone)
    .maybeSingle();
  if (customerError) throw customerError;
  if (!customer) return null;

  const { data: addresses, error: addressesError } = await admin
    .from("customer_addresses")
    .select("id, cep, street, number, complement, neighborhood, city, state")
    .eq("customer_id", customer.id)
    .order("created_at", { ascending: false });
  if (addressesError) throw addressesError;

  return {
    id: customer.id,
    name: customer.name,
    addresses: (addresses ?? []).map(mapAddressRow),
  };
}

export type NewAddressInput = {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
};

export async function saveCustomerOrder(params: {
  storeId: string;
  name: string;
  phone: string;
  addressId?: string;
  newAddress?: NewAddressInput;
}): Promise<void> {
  const admin = createAdminClient();

  const { data: customer, error: customerError } = await admin
    .from("customers")
    .upsert(
      { store_id: params.storeId, name: params.name, phone: params.phone },
      { onConflict: "store_id,phone" }
    )
    .select("id")
    .single();
  if (customerError || !customer) throw customerError ?? new Error("Erro ao salvar cliente");

  if (params.newAddress) {
    const { error: addressError } = await admin.from("customer_addresses").insert({
      customer_id: customer.id,
      ...params.newAddress,
    });
    if (addressError) throw addressError;
  }
}
