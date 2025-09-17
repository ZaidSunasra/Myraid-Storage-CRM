/*
  Warnings:

  - Made the column `quotation_product_id` on table `QuotationItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `profit_percent` on table `QuotationWorking` required. This step will fail if there are existing NULL values in that column.
  - Made the column `quotation_product_id` on table `QuotationWorking` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."QuotationItem" DROP CONSTRAINT "QuotationItem_quotation_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."QuotationWorking" DROP CONSTRAINT "QuotationWorking_quotation_product_id_fkey";

-- AlterTable
ALTER TABLE "public"."QuotationItem" ALTER COLUMN "quotation_product_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."QuotationWorking" ALTER COLUMN "profit_percent" SET NOT NULL,
ALTER COLUMN "quotation_product_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."QuotationItem" ADD CONSTRAINT "QuotationItem_quotation_product_id_fkey" FOREIGN KEY ("quotation_product_id") REFERENCES "public"."QuotationProducts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuotationWorking" ADD CONSTRAINT "QuotationWorking_quotation_product_id_fkey" FOREIGN KEY ("quotation_product_id") REFERENCES "public"."QuotationProducts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
