/*
  Warnings:

  - You are about to drop the column `assigned_to` on the `Deal` table. All the data in the column will be lost.
  - You are about to drop the column `related_id` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `related_type` on the `Notification` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Asignee" DROP CONSTRAINT "Asignee_lead_id_fkey";

-- DropForeignKey
ALTER TABLE "Deal" DROP CONSTRAINT "Deal_assigned_to_fkey";

-- AlterTable
ALTER TABLE "Asignee" ADD COLUMN     "deal_id" INTEGER,
ALTER COLUMN "lead_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Deal" DROP COLUMN "assigned_to";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "related_id",
DROP COLUMN "related_type",
ADD COLUMN     "deal_id" INTEGER,
ADD COLUMN     "lead_id" INTEGER;

-- DropEnum
DROP TYPE "Related_Type";

-- AddForeignKey
ALTER TABLE "Asignee" ADD CONSTRAINT "Asignee_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asignee" ADD CONSTRAINT "Asignee_deal_id_fkey" FOREIGN KEY ("deal_id") REFERENCES "Deal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_deal_id_fkey" FOREIGN KEY ("deal_id") REFERENCES "Deal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
