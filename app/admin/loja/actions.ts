"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session-helpers";
import { storeSettingsSchema, type StoreSettingsFormData } from "@/lib/schemas/store-settings";
import { businessHoursSchema, type BusinessHoursFormData } from "@/lib/schemas/business-hours";

export type SettingsInput = StoreSettingsFormData;
export type SettingsActionState = { error?: string };

export async function updateStoreSettings(data: SettingsInput): Promise<SettingsActionState> {
  await requireAdmin();
  const parsed = storeSettingsSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  await prisma.storeSettings.upsert({
    where: { id: 1 },
    update: parsed.data,
    create: { id: 1, ...parsed.data },
  });

  revalidatePath("/admin/loja");
  revalidatePath("/");
  revalidatePath("/checkout");
  revalidatePath("/loja/[slug]", "page");
  return {};
}

export type BusinessHoursInput = BusinessHoursFormData;

export async function updateBusinessHours(data: BusinessHoursInput): Promise<SettingsActionState> {
  await requireAdmin();
  const parsed = businessHoursSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const rows = parsed.data.days.flatMap((day) =>
    day.isOpen
      ? day.shifts.map((shift, sortOrder) => ({
          dayOfWeek: day.dayOfWeek,
          openTime: shift.openTime,
          closeTime: shift.closeTime,
          sortOrder,
        }))
      : []
  );

  await prisma.$transaction([
    prisma.businessHourShift.deleteMany({}),
    prisma.businessHourShift.createMany({ data: rows }),
  ]);

  revalidatePath("/admin/loja");
  revalidatePath("/");
  revalidatePath("/loja/[slug]", "page");
  return {};
}
