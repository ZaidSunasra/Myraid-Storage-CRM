/*
  Warnings:

  - You are about to drop the column `assigned_to` on the `Lead` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Lead" DROP CONSTRAINT "Lead_assigned_to_fkey";

-- AlterTable
ALTER TABLE "Lead" DROP COLUMN "assigned_to";

-- CreateTable
CREATE TABLE "Asignee" (
    "id" SERIAL NOT NULL,
    "lead_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Asignee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Asignee_lead_id_user_id_key" ON "Asignee"("lead_id", "user_id");

-- AddForeignKey
ALTER TABLE "Asignee" ADD CONSTRAINT "Asignee_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asignee" ADD CONSTRAINT "Asignee_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
