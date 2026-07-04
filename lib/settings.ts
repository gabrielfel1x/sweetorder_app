import { prisma } from "@/lib/prisma";
import type { StoreSettingsDTO } from "@/lib/types";

export async function getStoreSettings(): Promise<StoreSettingsDTO> {
  const row = await prisma.storeSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  return {
    storeName: row.storeName,
    storeDescription: row.storeDescription,
    slug: row.slug,
    email: row.email,
    whatsappNumber: row.whatsappNumber,
    whatsappMessageTemplate: row.whatsappMessageTemplate,
    freeDeliveryThreshold: row.freeDeliveryThreshold,
    deliveryFee: row.deliveryFee,
    instagramUrl: row.instagramUrl,
    acceptsPix: row.acceptsPix,
    pixKey: row.pixKey,
    acceptsCash: row.acceptsCash,
    acceptsCard: row.acceptsCard,
  };
}
