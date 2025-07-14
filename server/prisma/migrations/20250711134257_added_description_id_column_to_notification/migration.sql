-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "description_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_description_id_fkey" FOREIGN KEY ("description_id") REFERENCES "Description"("id") ON DELETE SET NULL ON UPDATE CASCADE;
