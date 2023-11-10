-- CreateTable
CREATE TABLE "permissions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "level" DECIMAL NOT NULL
);

-- CreateTable
CREATE TABLE "_PermissionToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_PermissionToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "permissions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PermissionToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_PermissionToUser_AB_unique" ON "_PermissionToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_PermissionToUser_B_index" ON "_PermissionToUser"("B");
