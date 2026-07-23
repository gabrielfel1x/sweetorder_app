import { getAllProductsForAdmin } from "@/lib/products";
import { requireAdmin } from "@/lib/session-helpers";
import { getStoreById } from "@/lib/settings";
import { ProductsAdmin } from "@/components/admin/products-admin";

export const metadata = {
  title: "Produtos — Painel administrativo",
};

export default async function AdminProductsPage() {
  const admin = await requireAdmin();
  const [products, store] = await Promise.all([
    getAllProductsForAdmin(admin.storeId),
    getStoreById(admin.storeId),
  ]);
  return (
    <ProductsAdmin
      initialProducts={products}
      brandIcon={store.brandIcon}
      acceptsInstallments={store.acceptsInstallments}
    />
  );
}
