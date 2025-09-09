/*
  Warnings:

  - You are about to drop the column `total_amount` on the `Quotation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Quotation" DROP COLUMN "total_amount",
ADD COLUMN     "grand_total" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "sub_total" DECIMAL(65,30) NOT NULL DEFAULT 0;
