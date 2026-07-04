-- CreateTable
CREATE TABLE "BusinessHourShift" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dayOfWeek" INTEGER NOT NULL,
    "openTime" TEXT NOT NULL,
    "closeTime" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StoreSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "storeName" TEXT NOT NULL DEFAULT 'Lolo Cookies',
    "storeDescription" TEXT NOT NULL DEFAULT 'Cookies artesanais feitos com amor, entregues fresquinhos.',
    "slug" TEXT NOT NULL DEFAULT 'loja',
    "email" TEXT NOT NULL DEFAULT '',
    "whatsappNumber" TEXT NOT NULL DEFAULT '5585992737489',
    "whatsappMessageTemplate" TEXT NOT NULL DEFAULT '🍪 *Novo Pedido — {{loja}}*

*Itens do pedido:*
{{itens}}

*Subtotal:* {{subtotal}}
*Taxa de entrega:* {{entrega}}
*💰 Total: {{total}}*

*Pagamento:* {{pagamento}}

*📍 Endereço de entrega:*
{{endereco}}',
    "freeDeliveryThreshold" REAL NOT NULL DEFAULT 50,
    "deliveryFee" REAL NOT NULL DEFAULT 8.9,
    "instagramUrl" TEXT NOT NULL DEFAULT '',
    "acceptsPix" BOOLEAN NOT NULL DEFAULT true,
    "pixKey" TEXT NOT NULL DEFAULT '',
    "acceptsCash" BOOLEAN NOT NULL DEFAULT true,
    "acceptsCard" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_StoreSettings" ("acceptsCard", "acceptsCash", "acceptsPix", "deliveryFee", "freeDeliveryThreshold", "id", "instagramUrl", "pixKey", "storeDescription", "storeName", "updatedAt", "whatsappNumber") SELECT "acceptsCard", "acceptsCash", "acceptsPix", "deliveryFee", "freeDeliveryThreshold", "id", "instagramUrl", "pixKey", "storeDescription", "storeName", "updatedAt", "whatsappNumber" FROM "StoreSettings";
DROP TABLE "StoreSettings";
ALTER TABLE "new_StoreSettings" RENAME TO "StoreSettings";
CREATE UNIQUE INDEX "StoreSettings_slug_key" ON "StoreSettings"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "BusinessHourShift_dayOfWeek_sortOrder_idx" ON "BusinessHourShift"("dayOfWeek", "sortOrder");

