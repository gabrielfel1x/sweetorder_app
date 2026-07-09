import { getAllProductsForAdmin } from "@/lib/products";
import { requireAdmin } from "@/lib/session-helpers";
import { ProductsAdmin } from "@/components/admin/products-admin";

export const metadata = {
  title: "Produtos — Painel administrativo",
};

export default async function AdminProductsPage() {
  const admin = await requireAdmin();
  const products = await getAllProductsForAdmin(admin.storeId);
  return <ProductsAdmin initialProducts={products} />;
}
