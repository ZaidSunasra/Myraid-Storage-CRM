/*
  Warnings:

  - The values [DRAWING,QUOTATION,HIGH_ORDER_VALUE,NEGOTIATION,ORDER_LOST,ORDER_CONFIRMED] on the enum `Deal_Status` will be removed. If these variants are still used in the database, this will fail.
  - The values [MARKETING,ADMIN,FACTORY,DRAWING] on the enum `Department` will be removed. If these variants are still used in the database, this will fail.
  - The values [COLOR_CHANGED,DRAWING_UPLOADED,DRAWING_APPROVED,DRAWING_REJECTED,CLIENT_MEETING] on the enum `Notification_Type` will be removed. If these variants are still used in the database, this will fail.
  - The values [LEAD,DEAL,ORDER] on the enum `Related_Type` will be removed. If these variants are still used in the database, this will fail.
  - The values [INDIAMART,GOOGLEADS] on the enum `Source` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Deal_Status_new" AS ENUM ('drawing', 'quotation', 'high_order_value', 'negotiation', 'order_lost', 'order_confirmed');
ALTER TABLE "Deal" ALTER COLUMN "deal_status" TYPE "Deal_Status_new" USING ("deal_status"::text::"Deal_Status_new");
ALTER TYPE "Deal_Status" RENAME TO "Deal_Status_old";
ALTER TYPE "Deal_Status_new" RENAME TO "Deal_Status";
DROP TYPE "Deal_Status_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Department_new" AS ENUM ('sales', 'admin', 'factory', 'drawing');
ALTER TABLE "User" ALTER COLUMN "department" TYPE "Department_new" USING ("department"::text::"Department_new");
ALTER TYPE "Department" RENAME TO "Department_old";
ALTER TYPE "Department_new" RENAME TO "Department";
DROP TYPE "Department_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Notification_Type_new" AS ENUM ('color_changed', 'drawing_uploaded', 'drawing_accepted', 'drawing_rejected', 'client_meeting');
ALTER TABLE "Notification" ALTER COLUMN "type" TYPE "Notification_Type_new" USING ("type"::text::"Notification_Type_new");
ALTER TYPE "Notification_Type" RENAME TO "Notification_Type_old";
ALTER TYPE "Notification_Type_new" RENAME TO "Notification_Type";
DROP TYPE "Notification_Type_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Related_Type_new" AS ENUM ('lead', 'deal', 'order');
ALTER TABLE "Notification" ALTER COLUMN "related_type" TYPE "Related_Type_new" USING ("related_type"::text::"Related_Type_new");
ALTER TYPE "Related_Type" RENAME TO "Related_Type_old";
ALTER TYPE "Related_Type_new" RENAME TO "Related_Type";
DROP TYPE "Related_Type_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Source_new" AS ENUM ('india_mart', 'google_ads');
ALTER TABLE "Lead" ALTER COLUMN "source" TYPE "Source_new" USING ("source"::text::"Source_new");
ALTER TYPE "Source" RENAME TO "Source_old";
ALTER TYPE "Source_new" RENAME TO "Source";
DROP TYPE "Source_old";
COMMIT;

-- DropIndex
DROP INDEX "Company_gst_no_key";

-- DropIndex
DROP INDEX "Lead_email_key";

-- AlterTable
ALTER TABLE "Lead" ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Notification" ALTER COLUMN "message" DROP NOT NULL;
