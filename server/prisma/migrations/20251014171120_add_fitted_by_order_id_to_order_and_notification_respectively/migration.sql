/*
  Warnings:

  - The `pi_number` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Notification" ADD COLUMN     "order_id" INTEGER;

-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "fitted_by" TEXT,
DROP COLUMN "pi_number",
ADD COLUMN     "pi_number" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
