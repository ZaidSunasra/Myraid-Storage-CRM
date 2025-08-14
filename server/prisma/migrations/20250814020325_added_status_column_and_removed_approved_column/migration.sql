/*
  Warnings:

  - You are about to drop the column `approved` on the `Drawing` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."Drawing_Status" AS ENUM ('pending', 'approved', 'rejected');

-- AlterTable
ALTER TABLE "public"."Drawing" DROP COLUMN "approved",
ADD COLUMN     "status" "public"."Drawing_Status" NOT NULL DEFAULT 'pending';
