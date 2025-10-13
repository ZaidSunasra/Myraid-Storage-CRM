/*
  Warnings:

  - A unique constraint covering the columns `[quotation_id]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `quotation_id` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "quotation_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Order_quotation_id_key" ON "public"."Order"("quotation_id");

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_quotation_id_fkey" FOREIGN KEY ("quotation_id") REFERENCES "public"."Quotation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
