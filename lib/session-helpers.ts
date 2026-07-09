import { createClient } from "@/lib/supabase/server";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

export type CurrentAdmin = AuthUser & {
  storeId: string;
};

export async function getAuthUser(): Promise<AuthUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  return {
    id: user.id,
    email: user.email ?? "",
    name: (user.user_metadata?.name as string | undefined) ?? "Admin",
  };
}

export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: storeAdmin } = await supabase
    .from("store_admins")
    .select("store_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!storeAdmin) return null;

  return {
    id: user.id,
    email: user.email ?? "",
    name: (user.user_metadata?.name as string | undefined) ?? "Admin",
    storeId: storeAdmin.store_id,
  };
}

export async function requireAdmin(): Promise<CurrentAdmin> {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Não autorizado");
  return admin;
}
