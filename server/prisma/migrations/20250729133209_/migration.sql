/*
  Warnings:

  - The primary key for the `Deal` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Asignee" DROP CONSTRAINT "Asignee_deal_id_fkey";

-- DropForeignKey
ALTER TABLE "Description" DROP CONSTRAINT "Description_deal_id_fkey";

-- DropForeignKey
ALTER TABLE "Drawing" DROP CONSTRAINT "Drawing_deal_id_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_deal_id_fkey";

-- DropForeignKey
ALTER TABLE "Quotation" DROP CONSTRAINT "Quotation_deal_id_fkey";

-- AlterTable
ALTER TABLE "Asignee" ALTER COLUMN "deal_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Deal" DROP CONSTRAINT "Deal_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Deal_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Deal_id_seq";

-- AlterTable
ALTER TABLE "Description" ALTER COLUMN "deal_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Drawing" ALTER COLUMN "deal_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Notification" ALTER COLUMN "deal_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Quotation" ALTER COLUMN "deal_id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Description" ADD CONSTRAINT "Description_deal_id_fkey" FOREIGN KEY ("deal_id") REFERENCES "Deal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asignee" ADD CONSTRAINT "Asignee_deal_id_fkey" FOREIGN KEY ("deal_id") REFERENCES "Deal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_deal_id_fkey" FOREIGN KEY ("deal_id") REFERENCES "Deal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Drawing" ADD CONSTRAINT "Drawing_deal_id_fkey" FOREIGN KEY ("deal_id") REFERENCES "Deal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_deal_id_fkey" FOREIGN KEY ("deal_id") REFERENCES "Deal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
