/*
  Warnings:

  - Made the column `file_size` on table `Drawing` required. This step will fail if there are existing NULL values in that column.
  - Made the column `file_type` on table `Drawing` required. This step will fail if there are existing NULL values in that column.
  - Made the column `uploaded_by` on table `Drawing` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Drawing" DROP CONSTRAINT "Drawing_uploaded_by_fkey";

-- AlterTable
ALTER TABLE "public"."Drawing" ALTER COLUMN "file_size" SET NOT NULL,
ALTER COLUMN "file_type" SET NOT NULL,
ALTER COLUMN "uploaded_by" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Drawing" ADD CONSTRAINT "Drawing_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
