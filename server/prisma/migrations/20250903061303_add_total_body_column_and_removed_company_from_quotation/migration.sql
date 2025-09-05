/*
  Warnings:

  - You are about to drop the column `company_id` on the `Quotation` table. All the data in the column will be lost.
  - Added the required column `total_body` to the `QuotationWorking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Quotation" DROP CONSTRAINT "Quotation_company_id_fkey";

-- AlterTable
ALTER TABLE "public"."Quotation" DROP COLUMN "company_id";

-- AlterTable
ALTER TABLE "public"."QuotationWorking" ADD COLUMN     "total_body" INTEGER NOT NULL;
