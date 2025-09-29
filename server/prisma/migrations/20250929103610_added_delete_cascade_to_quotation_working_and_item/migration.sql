-- DropForeignKey
ALTER TABLE "public"."QuotationItem" DROP CONSTRAINT "QuotationItem_quotation_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."QuotationWorking" DROP CONSTRAINT "QuotationWorking_quotation_product_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."QuotationItem" ADD CONSTRAINT "QuotationItem_quotation_product_id_fkey" FOREIGN KEY ("quotation_product_id") REFERENCES "public"."QuotationProducts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuotationWorking" ADD CONSTRAINT "QuotationWorking_quotation_product_id_fkey" FOREIGN KEY ("quotation_product_id") REFERENCES "public"."QuotationProducts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
