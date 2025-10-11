/*
  Warnings:

  - A unique constraint covering the columns `[quotation_no]` on the table `Quotation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Quotation_quotation_no_key" ON "public"."Quotation"("quotation_no");
