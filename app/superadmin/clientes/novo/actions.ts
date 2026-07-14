"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireSuperAdmin } from "@/lib/session-helpers";
import { createStoreForUser } from "@/app/cadastro/actions";
import { inviteClientSchema } from "@/lib/schemas/superadmin";

export type InviteClientState = { error?: string; success?: boolean };

async function getSiteUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

export async function inviteClientAction(
  _prev: InviteClientState,
  formData: FormData
): Promise<InviteClientState> {
  await requireSuperAdmin();

  const parsed = inviteClientSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    storeName: String(formData.get("storeName") ?? ""),
    slug: String(formData.get("slug") ?? ""),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const supabase = await createClient();
  const { data: existingSlug } = await supabase
    .from("stores")
    .select("id")
    .eq("slug", parsed.data.slug)
    .maybeSingle();
  if (existingSlug) return { error: "Esse slug já está em uso, escolha outro" };

  const admin = createAdminClient();
  const siteUrl = await getSiteUrl();
  const { data: inviteData, error: inviteError } = await admin.auth.admin.inviteUserByEmail(
    parsed.data.email,
    {
      data: { name: parsed.data.name },
      redirectTo: `${siteUrl}/convite`,
    }
  );
  if (inviteError || !inviteData.user) {
    return {
      error:
        inviteError?.message?.toLowerCase().includes("already registered") ||
        inviteError?.message?.toLowerCase().includes("already been registered")
          ? "Esse e-mail já está cadastrado"
          : "Não foi possível enviar o convite",
    };
  }

  const storeError = await createStoreForUser(
    supabase,
    inviteData.user.id,
    parsed.data.storeName,
    parsed.data.slug
  );
  if (storeError) {
    await admin.auth.admin.deleteUser(inviteData.user.id);
    return { error: storeError };
  }

  return { success: true };
}
