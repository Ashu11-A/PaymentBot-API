-- CreateTable
CREATE TABLE "products_categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "idProduct" TEXT NOT NULL,
    "idCategory" TEXT NOT NULL,
    CONSTRAINT "products_categories_idProduct_fkey" FOREIGN KEY ("idProduct") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "products_categories_idCategory_fkey" FOREIGN KEY ("idCategory") REFERENCES "categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
