-- CreateTable
CREATE TABLE "QuotationItem" (
    "id" SERIAL NOT NULL,
    "quotation_id" INTEGER NOT NULL,
    "item_name" TEXT NOT NULL,
    "rate" DECIMAL(65,30) NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "QuotationItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuotationItem" ADD CONSTRAINT "QuotationItem_quotation_id_fkey" FOREIGN KEY ("quotation_id") REFERENCES "Quotation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
