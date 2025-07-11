-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Notification_Type" ADD VALUE 'mentioned';
ALTER TYPE "Notification_Type" ADD VALUE 'lead_assigned';

-- AlterTable
ALTER TABLE "Recipient" ADD COLUMN     "is_ready" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ready_at" TIMESTAMP(3);
