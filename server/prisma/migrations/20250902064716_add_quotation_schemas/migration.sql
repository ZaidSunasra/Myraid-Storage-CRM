/*
  Warnings:

  - The values [A,B,C,D] on the enum `Quotation_Template` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `subject` to the `Quotation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `depth` to the `QuotationItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `height` to the `QuotationItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `item_code` to the `QuotationItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `QuotationItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."Quotation_Template_new" AS ENUM ('set_wise', 'item_wise');
ALTER TABLE "public"."Quotation" ALTER COLUMN "quotation_template" TYPE "public"."Quotation_Template_new" USING ("quotation_template"::text::"public"."Quotation_Template_new");
ALTER TYPE "public"."Quotation_Template" RENAME TO "Quotation_Template_old";
ALTER TYPE "public"."Quotation_Template_new" RENAME TO "Quotation_Template";
DROP TYPE "public"."Quotation_Template_old";
COMMIT;

-- AlterTable
ALTER TABLE "public"."Quotation" ADD COLUMN     "discount" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "gst" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "round_off" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "subject" TEXT NOT NULL,
ADD COLUMN     "total_amount" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."QuotationItem" ADD COLUMN     "depth" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "height" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "item_code" TEXT NOT NULL,
ADD COLUMN     "width" DECIMAL(65,30) NOT NULL;

-- CreateTable
CREATE TABLE "public"."QuotationWorking" (
    "id" SERIAL NOT NULL,
    "quotation_id" INTEGER NOT NULL,
    "total_weight" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "sheet_material" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "trolley_material" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "powder_coating" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "labour_cost" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "installation" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "transport" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "accomodation" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "provided_total_cost" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "provided_rate" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "provided_profit" DECIMAL(65,30) NOT NULL,
    "market_rate" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "market_total_cost" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "market_profit" DECIMAL(65,30) NOT NULL DEFAULT 0,

    CONSTRAINT "QuotationWorking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BaseProduct" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "default_height" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "default_weight" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "default_depth" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "per_bay_qty" INTEGER NOT NULL,
    "compartment" INTEGER NOT NULL,

    CONSTRAINT "BaseProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuotationWorking_quotation_id_key" ON "public"."QuotationWorking"("quotation_id");

-- AddForeignKey
ALTER TABLE "public"."QuotationWorking" ADD CONSTRAINT "QuotationWorking_quotation_id_fkey" FOREIGN KEY ("quotation_id") REFERENCES "public"."Quotation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
