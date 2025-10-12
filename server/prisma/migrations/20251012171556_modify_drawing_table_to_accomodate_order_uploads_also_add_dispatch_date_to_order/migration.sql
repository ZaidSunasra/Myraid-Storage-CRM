/*
  Warnings:

  - You are about to drop the column `drawing_url` on the `Drawing` table. All the data in the column will be lost.
  - You are about to drop the column `quotation_id` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[file_url]` on the table `Drawing` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `file_url` to the `Drawing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `upload_type` to the `Drawing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dispatch_at` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Upload_Type" AS ENUM ('drawing', 'po', 'pi', 'general');

-- CreateEnum
CREATE TYPE "public"."Order_Status" AS ENUM ('pending', 'in_progress', 'dispatched');

-- DropForeignKey
ALTER TABLE "public"."Drawing" DROP CONSTRAINT "Drawing_deal_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_quotation_id_fkey";

-- DropIndex
DROP INDEX "public"."Drawing_drawing_url_key";

-- DropIndex
DROP INDEX "public"."Order_quotation_id_key";

-- AlterTable
ALTER TABLE "public"."Drawing" DROP COLUMN "drawing_url",
ADD COLUMN     "file_url" TEXT NOT NULL,
ADD COLUMN     "order_id" INTEGER,
ADD COLUMN     "show_in_order" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "upload_type" "public"."Upload_Type" NOT NULL,
ALTER COLUMN "version" DROP NOT NULL,
ALTER COLUMN "deal_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Order" DROP COLUMN "quotation_id",
ADD COLUMN     "dispatch_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" "public"."Order_Status" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Drawing_file_url_key" ON "public"."Drawing"("file_url");

-- AddForeignKey
ALTER TABLE "public"."Drawing" ADD CONSTRAINT "Drawing_deal_id_fkey" FOREIGN KEY ("deal_id") REFERENCES "public"."Deal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Drawing" ADD CONSTRAINT "Drawing_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
