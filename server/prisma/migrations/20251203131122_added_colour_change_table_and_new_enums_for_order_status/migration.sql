/*
  Warnings:

  - You are about to drop the column `colour` on the `Order` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Order_Status" ADD VALUE 'fabrication_ready';
ALTER TYPE "Order_Status" ADD VALUE 'ready';

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "colour",
ADD COLUMN     "count_order" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "powder_coating" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "ColourChange" (
    "id" SERIAL NOT NULL,
    "colour" TEXT NOT NULL,
    "changed_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "order_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "ColourChange_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ColourChange_order_id_idx" ON "ColourChange"("order_id");

-- AddForeignKey
ALTER TABLE "ColourChange" ADD CONSTRAINT "ColourChange_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ColourChange" ADD CONSTRAINT "ColourChange_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
