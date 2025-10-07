/*
  Warnings:

  - The `product_type` column on the `BaseProduct` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."BaseProduct" DROP COLUMN "product_type",
ADD COLUMN     "product_type" TEXT NOT NULL DEFAULT 'compactor';

-- DropEnum
DROP TYPE "public"."Product_Type";
