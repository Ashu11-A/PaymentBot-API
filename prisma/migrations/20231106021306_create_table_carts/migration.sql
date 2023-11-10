-- CreateTable
CREATE TABLE "carts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" INTEGER NOT NULL,
    "productName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "paymentId" TEXT
);
