/*
  Warnings:

  - You are about to drop the column `subject` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `quotation_id` on the `QuotationItem` table. All the data in the column will be lost.
  - You are about to drop the column `quotation_id` on the `QuotationWorking` table. All the data in the column will be lost.
  - You are about to drop the column `sheet_material` on the `QuotationWorking` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."QuotationItem" DROP CONSTRAINT "QuotationItem_quotation_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."QuotationWorking" DROP CONSTRAINT "QuotationWorking_quotation_id_fkey";

-- DropIndex
DROP INDEX "public"."QuotationWorking_quotation_id_key";

-- AlterTable
ALTER TABLE "public"."Quotation" DROP COLUMN "subject";

-- AlterTable
ALTER TABLE "public"."QuotationItem" DROP COLUMN "quotation_id",
ADD COLUMN     "quotation_product_id" INTEGER;

-- AlterTable
ALTER TABLE "public"."QuotationWorking" DROP COLUMN "quotation_id",
DROP COLUMN "sheet_material",
ADD COLUMN     "profit_percent" INTEGER,
ADD COLUMN     "quotation_product_id" INTEGER,
ADD COLUMN     "set" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "ss_material" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."QuotationProducts" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "quotation_id" INTEGER NOT NULL,

    CONSTRAINT "QuotationProducts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."QuotationProducts" ADD CONSTRAINT "QuotationProducts_quotation_id_fkey" FOREIGN KEY ("quotation_id") REFERENCES "public"."Quotation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuotationItem" ADD CONSTRAINT "QuotationItem_quotation_product_id_fkey" FOREIGN KEY ("quotation_product_id") REFERENCES "public"."QuotationProducts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuotationWorking" ADD CONSTRAINT "QuotationWorking_quotation_product_id_fkey" FOREIGN KEY ("quotation_product_id") REFERENCES "public"."QuotationProducts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
