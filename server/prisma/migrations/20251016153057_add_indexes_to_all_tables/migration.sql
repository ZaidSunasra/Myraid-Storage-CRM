-- CreateIndex
CREATE INDEX "Advance_order_id_idx" ON "public"."Advance"("order_id");

-- CreateIndex
CREATE INDEX "Asignee_user_id_idx" ON "public"."Asignee"("user_id");

-- CreateIndex
CREATE INDEX "Asignee_lead_id_idx" ON "public"."Asignee"("lead_id");

-- CreateIndex
CREATE INDEX "Asignee_deal_id_idx" ON "public"."Asignee"("deal_id");

-- CreateIndex
CREATE INDEX "BaseProduct_product_type_idx" ON "public"."BaseProduct"("product_type");

-- CreateIndex
CREATE INDEX "Client_company_id_idx" ON "public"."Client"("company_id");

-- CreateIndex
CREATE INDEX "Company_name_idx" ON "public"."Company"("name");

-- CreateIndex
CREATE INDEX "Company_gst_no_idx" ON "public"."Company"("gst_no");

-- CreateIndex
CREATE INDEX "Deal_company_id_idx" ON "public"."Deal"("company_id");

-- CreateIndex
CREATE INDEX "Deal_client_id_idx" ON "public"."Deal"("client_id");

-- CreateIndex
CREATE INDEX "Deal_source_id_idx" ON "public"."Deal"("source_id");

-- CreateIndex
CREATE INDEX "Deal_product_id_idx" ON "public"."Deal"("product_id");

-- CreateIndex
CREATE INDEX "Deal_lead_id_idx" ON "public"."Deal"("lead_id");

-- CreateIndex
CREATE INDEX "Deal_deal_status_idx" ON "public"."Deal"("deal_status");

-- CreateIndex
CREATE INDEX "Description_lead_id_idx" ON "public"."Description"("lead_id");

-- CreateIndex
CREATE INDEX "Description_deal_id_idx" ON "public"."Description"("deal_id");

-- CreateIndex
CREATE INDEX "Drawing_deal_id_idx" ON "public"."Drawing"("deal_id");

-- CreateIndex
CREATE INDEX "Drawing_order_id_idx" ON "public"."Drawing"("order_id");

-- CreateIndex
CREATE INDEX "Drawing_status_idx" ON "public"."Drawing"("status");

-- CreateIndex
CREATE INDEX "Email_client_id_idx" ON "public"."Email"("client_id");

-- CreateIndex
CREATE INDEX "Lead_created_at_idx" ON "public"."Lead"("created_at");

-- CreateIndex
CREATE INDEX "Lead_source_id_idx" ON "public"."Lead"("source_id");

-- CreateIndex
CREATE INDEX "Lead_product_id_idx" ON "public"."Lead"("product_id");

-- CreateIndex
CREATE INDEX "Lead_is_converted_idx" ON "public"."Lead"("is_converted");

-- CreateIndex
CREATE INDEX "Notification_type_idx" ON "public"."Notification"("type");

-- CreateIndex
CREATE INDEX "Notification_is_sent_idx" ON "public"."Notification"("is_sent");

-- CreateIndex
CREATE INDEX "Notification_created_at_idx" ON "public"."Notification"("created_at");

-- CreateIndex
CREATE INDEX "Notification_lead_id_idx" ON "public"."Notification"("lead_id");

-- CreateIndex
CREATE INDEX "Notification_deal_id_idx" ON "public"."Notification"("deal_id");

-- CreateIndex
CREATE INDEX "Notification_order_id_idx" ON "public"."Notification"("order_id");

-- CreateIndex
CREATE INDEX "Order_deal_id_idx" ON "public"."Order"("deal_id");

-- CreateIndex
CREATE INDEX "Order_quotation_id_idx" ON "public"."Order"("quotation_id");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "public"."Order"("status");

-- CreateIndex
CREATE INDEX "Order_order_number_idx" ON "public"."Order"("order_number");

-- CreateIndex
CREATE INDEX "Permission_permission_key_idx" ON "public"."Permission"("permission_key");

-- CreateIndex
CREATE INDEX "Phone_client_id_idx" ON "public"."Phone"("client_id");

-- CreateIndex
CREATE INDEX "Quotation_deal_id_idx" ON "public"."Quotation"("deal_id");

-- CreateIndex
CREATE INDEX "Quotation_created_by_idx" ON "public"."Quotation"("created_by");

-- CreateIndex
CREATE INDEX "QuotationItem_quotation_product_id_idx" ON "public"."QuotationItem"("quotation_product_id");

-- CreateIndex
CREATE INDEX "QuotationProducts_quotation_id_idx" ON "public"."QuotationProducts"("quotation_id");

-- CreateIndex
CREATE INDEX "QuotationWorking_quotation_product_id_idx" ON "public"."QuotationWorking"("quotation_product_id");

-- CreateIndex
CREATE INDEX "Recipient_user_id_idx" ON "public"."Recipient"("user_id");

-- CreateIndex
CREATE INDEX "Recipient_notification_id_idx" ON "public"."Recipient"("notification_id");

-- CreateIndex
CREATE INDEX "Recipient_is_read_idx" ON "public"."Recipient"("is_read");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_phone_idx" ON "public"."User"("phone");

-- CreateIndex
CREATE INDEX "User_department_idx" ON "public"."User"("department");
