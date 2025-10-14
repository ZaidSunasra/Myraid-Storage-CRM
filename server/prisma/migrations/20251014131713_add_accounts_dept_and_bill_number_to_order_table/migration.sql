-- AlterEnum
ALTER TYPE "public"."Department" ADD VALUE 'accounts';

-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "bill_number" TEXT;
