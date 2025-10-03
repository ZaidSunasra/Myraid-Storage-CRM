-- DropForeignKey
ALTER TABLE "public"."QuotationProducts" DROP CONSTRAINT "QuotationProducts_quotation_id_fkey";

-- AlterTable
ALTER TABLE "public"."Quotation" ADD COLUMN     "quotation_no" TEXT NOT NULL DEFAULT 'deal_id';

-- AlterTable
ALTER TABLE "public"."QuotationWorking" ALTER COLUMN "metal_rate" DROP DEFAULT,
ALTER COLUMN "metal_rate" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "public"."QuotationProducts" ADD CONSTRAINT "QuotationProducts_quotation_id_fkey" FOREIGN KEY ("quotation_id") REFERENCES "public"."Quotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
