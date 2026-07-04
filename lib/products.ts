import { prisma } from "@/lib/prisma";
import type { ProductAdminDTO, ProductDTO } from "@/lib/types";

export async function getActiveProducts(): Promise<ProductDTO[]> {
  const rows = await prisma.product.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });

  return rows.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    category: p.category,
    visual: { bg: p.visualBg, emoji: p.visualEmoji },
  }));
}

export async function getAllProductsForAdmin(): Promise<ProductAdminDTO[]> {
  const rows = await prisma.product.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return rows.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    category: p.category,
    visual: { bg: p.visualBg, emoji: p.visualEmoji },
    active: p.active,
    sortOrder: p.sortOrder,
  }));
}
