-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StoreSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "storeName" TEXT NOT NULL DEFAULT 'Lolo Cookies',
    "storeDescription" TEXT NOT NULL DEFAULT 'Cookies artesanais feitos com amor, entregues fresquinhos.',
    "whatsappNumber" TEXT NOT NULL DEFAULT '5585992737489',
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
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

