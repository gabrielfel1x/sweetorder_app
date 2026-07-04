import { Checkout } from "@/components/checkout";
import { getStoreSettings } from "@/lib/settings";

export const metadata = {
  title: "Finalizar Pedido — SweetOrder",
};

export default async function CheckoutPage() {
  const settings = await getStoreSettings();
  return <Checkout settings={settings} />;
}
