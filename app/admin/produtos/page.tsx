import { getAllProductsForAdmin } from "@/lib/products";
import { ProductsAdmin } from "@/components/admin/products-admin";

export const metadata = {
  title: "Produtos — Painel administrativo",
};

export default async function AdminProductsPage() {
  const products = await getAllProductsForAdmin();
  return <ProductsAdmin initialProducts={products} />;
}
