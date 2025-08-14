/*
  Warnings:

  - You are about to drop the column `locked` on the `Drawing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Drawing" DROP COLUMN "locked",
ADD COLUMN     "note" TEXT;
