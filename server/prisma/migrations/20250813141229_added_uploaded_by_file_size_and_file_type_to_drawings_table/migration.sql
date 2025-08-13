-- AlterTable
ALTER TABLE "public"."Drawing" ADD COLUMN     "file_size" INTEGER,
ADD COLUMN     "file_type" TEXT,
ADD COLUMN     "uploaded_by" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Drawing" ADD CONSTRAINT "Drawing_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
