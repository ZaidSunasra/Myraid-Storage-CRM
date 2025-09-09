/*
  Warnings:

  - You are about to drop the column `rate` on the `QuotationItem` table. All the data in the column will be lost.
  - You are about to drop the column `market_profit` on the `QuotationWorking` table. All the data in the column will be lost.
  - You are about to drop the column `market_rate` on the `QuotationWorking` table. All the data in the column will be lost.
  - You are about to drop the column `provided_profit` on the `QuotationWorking` table. All the data in the column will be lost.
  - You are about to drop the column `provided_rate` on the `QuotationWorking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."QuotationItem" DROP COLUMN "rate",
ADD COLUMN     "market_rate" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "provided_rate" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."QuotationWorking" DROP COLUMN "market_profit",
DROP COLUMN "market_rate",
DROP COLUMN "provided_profit",
DROP COLUMN "provided_rate",
ADD COLUMN     "metal_rate" DECIMAL(65,30) NOT NULL DEFAULT 0;
