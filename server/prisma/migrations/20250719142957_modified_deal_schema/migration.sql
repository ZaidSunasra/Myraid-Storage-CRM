/*
  Warnings:

  - Added the required column `client_id` to the `Deal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lead_id` to the `Deal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `Deal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source_id` to the `Deal` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Description" DROP CONSTRAINT "Description_lead_id_fkey";

-- DropIndex
DROP INDEX "Asignee_lead_id_user_id_key";

-- AlterTable
ALTER TABLE "Deal" ADD COLUMN     "client_id" INTEGER NOT NULL,
ADD COLUMN     "lead_id" INTEGER NOT NULL,
ADD COLUMN     "product_id" INTEGER NOT NULL,
ADD COLUMN     "source_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Description" ADD COLUMN     "deal_id" INTEGER,
ALTER COLUMN "lead_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "is_converted" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Description" ADD CONSTRAINT "Description_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Description" ADD CONSTRAINT "Description_deal_id_fkey" FOREIGN KEY ("deal_id") REFERENCES "Deal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "Source"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
