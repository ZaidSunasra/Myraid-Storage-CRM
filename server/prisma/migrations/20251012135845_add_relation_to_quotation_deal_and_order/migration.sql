/*
  Warnings:

  - A unique constraint covering the columns `[quotation_id]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[deal_id]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `deal_id` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "deal_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Order_quotation_id_key" ON "public"."Order"("quotation_id");

-- CreateIndex
CREATE UNIQUE INDEX "Order_deal_id_key" ON "public"."Order"("deal_id");

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_deal_id_fkey" FOREIGN KEY ("deal_id") REFERENCES "public"."Deal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
