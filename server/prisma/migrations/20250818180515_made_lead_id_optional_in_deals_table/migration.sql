-- DropForeignKey
ALTER TABLE "public"."Deal" DROP CONSTRAINT "Deal_lead_id_fkey";

-- AlterTable
ALTER TABLE "public"."Deal" ALTER COLUMN "lead_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Deal" ADD CONSTRAINT "Deal_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "public"."Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;
