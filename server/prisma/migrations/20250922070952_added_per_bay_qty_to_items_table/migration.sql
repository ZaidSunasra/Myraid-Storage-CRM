/*
  Warnings:

  - Added the required column `per_bay_qty` to the `QuotationItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."QuotationItem" ADD COLUMN     "per_bay_qty" INTEGER NOT NULL;
