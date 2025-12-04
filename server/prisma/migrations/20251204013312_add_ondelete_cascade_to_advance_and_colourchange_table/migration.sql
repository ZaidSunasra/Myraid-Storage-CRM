-- DropForeignKey
ALTER TABLE "Advance" DROP CONSTRAINT "Advance_order_id_fkey";

-- DropForeignKey
ALTER TABLE "ColourChange" DROP CONSTRAINT "ColourChange_order_id_fkey";

-- AddForeignKey
ALTER TABLE "Advance" ADD CONSTRAINT "Advance_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ColourChange" ADD CONSTRAINT "ColourChange_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
