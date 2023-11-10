/*
  Warnings:

  - You are about to drop the column `productName` on the `carts` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `carts` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `carts` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal`.
  - Made the column `name` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "cart_items" (
    "cartId" INTEGER NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    PRIMARY KEY ("cartId", "productId"),
    CONSTRAINT "cart_items_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "carts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "cart_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_carts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" DECIMAL NOT NULL,
    "paymentId" TEXT
);
INSERT INTO "new_carts" ("amount", "id", "paymentId") SELECT "amount", "id", "paymentId" FROM "carts";
DROP TABLE "carts";
ALTER TABLE "new_carts" RENAME TO "carts";
CREATE TABLE "new_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_users" ("created_at", "email", "id", "name", "password", "updated_at") SELECT "created_at", "email", "id", "name", "password", "updated_at" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
