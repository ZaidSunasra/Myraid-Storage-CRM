/*
  Warnings:

  - Changed the type of `order_number` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Order" DROP COLUMN "order_number",
ADD COLUMN     "order_number" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Order_order_number_key" ON "public"."Order"("order_number");
