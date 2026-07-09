import { StoreDirectory } from "@/components/store-directory";
import { getAllStores } from "@/lib/settings";

export default async function Home() {
  const stores = await getAllStores();
  return <StoreDirectory stores={stores} />;
}
