/*
  Warnings:

  - You are about to drop the column `default_weight` on the `BaseProduct` table. All the data in the column will be lost.
  - You are about to alter the column `default_height` on the `BaseProduct` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `default_depth` on the `BaseProduct` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `quantity` on the `QuotationItem` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `depth` on the `QuotationItem` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `height` on the `QuotationItem` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `width` on the `QuotationItem` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "public"."BaseProduct" DROP COLUMN "default_weight",
ADD COLUMN     "default_width" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "default_height" SET DEFAULT 0,
ALTER COLUMN "default_height" SET DATA TYPE INTEGER,
ALTER COLUMN "default_depth" SET DEFAULT 0,
ALTER COLUMN "default_depth" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "public"."QuotationItem" ALTER COLUMN "quantity" SET DATA TYPE INTEGER,
ALTER COLUMN "depth" SET DATA TYPE INTEGER,
ALTER COLUMN "height" SET DATA TYPE INTEGER,
ALTER COLUMN "width" SET DATA TYPE INTEGER;
