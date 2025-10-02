/*
  Warnings:

  - You are about to drop the column `discount` on the `Quotation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Quotation" DROP COLUMN "discount";

-- AlterTable
ALTER TABLE "public"."QuotationWorking" ADD COLUMN     "discount" DECIMAL(65,30) NOT NULL DEFAULT 0;
