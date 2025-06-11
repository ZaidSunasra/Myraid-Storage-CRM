-- CreateTable
CREATE TABLE "Leads" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "assigned_to" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "gst_No" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Leads_gst_No_key" ON "Leads"("gst_No");
