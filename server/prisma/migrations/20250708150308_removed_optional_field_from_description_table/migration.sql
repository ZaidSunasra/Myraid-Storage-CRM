/*
  Warnings:

  - Made the column `lead_id` on table `Description` required. This step will fail if there are existing NULL values in that column.
  - Made the column `notes` on table `Description` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Description" DROP CONSTRAINT "Description_lead_id_fkey";

-- AlterTable
ALTER TABLE "Description" ALTER COLUMN "lead_id" SET NOT NULL,
ALTER COLUMN "notes" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Description" ADD CONSTRAINT "Description_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
