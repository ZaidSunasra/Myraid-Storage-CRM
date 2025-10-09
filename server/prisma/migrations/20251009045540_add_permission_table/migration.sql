-- CreateTable
CREATE TABLE "public"."Permission" (
    "id" SERIAL NOT NULL,
    "permission_key" TEXT NOT NULL,
    "allowed_dept" "public"."Department"[],

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);
