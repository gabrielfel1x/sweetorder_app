import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type ClientOverviewDTO = {
  storeId: string;
  storeName: string;
  slug: string;
  createdAt: string;
  productCount: number;
  adminName: string;
  adminEmail: string;
};

async function buildUserLookup(): Promise<Map<string, { name: string; email: string }>> {
  const admin = createAdminClient();
  const lookup = new Map<string, { name: string; email: string }>();

  let page = 1;
  for (;;) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    for (const user of data.users) {
      lookup.set(user.id, {
        name: (user.user_metadata?.name as string | undefined) ?? "Sem nome",
        email: user.email ?? "",
      });
    }
    if (data.users.length < 200) break;
    page += 1;
  }

  return lookup;
}

export async function getAllClientsOverview(): Promise<ClientOverviewDTO[]> {
  const supabase = await createClient();

  const [{ data: stores, error: storesError }, { data: storeAdmins, error: adminsError }, { data: products, error: productsError }] =
    await Promise.all([
      supabase.from("stores").select("id, store_name, slug, created_at").order("created_at", { ascending: false }),
      supabase.from("store_admins").select("store_id, user_id"),
      supabase.from("products").select("store_id"),
    ]);
  if (storesError) throw storesError;
  if (adminsError) throw adminsError;
  if (productsError) throw productsError;

  const userLookup = await buildUserLookup();

  const adminByStore = new Map((storeAdmins ?? []).map((row) => [row.store_id, row.user_id]));
  const productCountByStore = new Map<string, number>();
  for (const row of products ?? []) {
    productCountByStore.set(row.store_id, (productCountByStore.get(row.store_id) ?? 0) + 1);
  }

  return (stores ?? []).map((store) => {
    const userId = adminByStore.get(store.id);
    const user = userId ? userLookup.get(userId) : undefined;
    return {
      storeId: store.id,
      storeName: store.store_name,
      slug: store.slug,
      createdAt: store.created_at,
      productCount: productCountByStore.get(store.id) ?? 0,
      adminName: user?.name ?? "Sem administrador",
      adminEmail: user?.email ?? "—",
    };
  });
}

export type ClientDetailDTO = {
  storeId: string;
  storeName: string;
  storeDescription: string;
  slug: string;
  email: string;
  whatsappNumber: string;
  createdAt: string;
  productCount: number;
  adminName: string;
  adminEmail: string;
};

export async function getClientDetail(storeId: string): Promise<ClientDetailDTO | null> {
  const supabase = await createClient();

  const [{ data: store, error: storeError }, { data: storeAdmin }, { count: productCount }] = await Promise.all([
    supabase
      .from("stores")
      .select("id, store_name, store_description, slug, email, whatsapp_number, created_at")
      .eq("id", storeId)
      .maybeSingle(),
    supabase.from("store_admins").select("user_id").eq("store_id", storeId).maybeSingle(),
    supabase.from("products").select("*", { count: "exact", head: true }).eq("store_id", storeId),
  ]);
  if (storeError) throw storeError;
  if (!store) return null;

  let adminName = "Sem administrador";
  let adminEmail = "—";
  if (storeAdmin?.user_id) {
    const admin = createAdminClient();
    const { data } = await admin.auth.admin.getUserById(storeAdmin.user_id);
    if (data.user) {
      adminName = (data.user.user_metadata?.name as string | undefined) ?? "Sem nome";
      adminEmail = data.user.email ?? "—";
    }
  }

  return {
    storeId: store.id,
    storeName: store.store_name,
    storeDescription: store.store_description,
    slug: store.slug,
    email: store.email,
    whatsappNumber: store.whatsapp_number,
    createdAt: store.created_at,
    productCount: productCount ?? 0,
    adminName,
    adminEmail,
  };
}
