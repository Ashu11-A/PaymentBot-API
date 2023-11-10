/*
  Warnings:

  - You are about to drop the `_PermissionToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `permissionId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_PermissionToUser_B_index";

-- DropIndex
DROP INDEX "_PermissionToUser_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_PermissionToUser";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "permissionId" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "users_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_users" ("created_at", "email", "id", "name", "password", "updated_at") SELECT "created_at", "email", "id", "name", "password", "updated_at" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
