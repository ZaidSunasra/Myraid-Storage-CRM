/*
  Warnings:

  - Added the required column `product_type` to the `BaseProduct` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Product_Type" AS ENUM ('compactor', 'locker');

-- AlterTable
ALTER TABLE "public"."BaseProduct" ADD COLUMN     "product_type" "public"."Product_Type" NOT NULL;
