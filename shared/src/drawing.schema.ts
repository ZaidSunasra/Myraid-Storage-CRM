import z from "zod/v4";
import { Assignee, SuccessResponse } from "./common.schema";

export const DRAWING_VERSION = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "t", "U", "V", "W", "X", "Y", "Z"] as const;
export type drawing_version = typeof DRAWING_VERSION[number];

export const DRAWING_STATUS = ["pending", "approved", "rejected"] as const;
export type drawing_status = typeof DRAWING_STATUS[number];

export const UPLOAD_TYPE = ["pi", "po", "drawing", "general"] as const;
export type upload_type = typeof UPLOAD_TYPE[number];

export const uploadDrawingFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    version: z.enum(DRAWING_VERSION),
    file: z.instanceof(File, { message: "File is required" }).nullable().refine(f => f !== null, { message: "File is required", }),
    upload_type: z.enum(UPLOAD_TYPE),
});

export const getUploadUrlSchema = z.object({
    fileName: z.string().min(1, "File Name is required"),
    fileType: z.string().min(1, "Type is required"),
    upload_type: z.enum(UPLOAD_TYPE),
});

export const uploadDrawingSchema = z.object({
    drawing_url: z.string().min(1, "URL is required"),
    title: z.string().min(1, "Title is required"),
    version: z.enum(DRAWING_VERSION),
    upload_type: z.enum(UPLOAD_TYPE),
    deal_id: z.string(),
    order_id: z.string(),
    file_size: z.coerce.number(),
    file_type: z.string().min(1, "File type is required"),
    context: z.enum(["deal", "order"])
});

export const rejectDrawingSchema = z.object({
    note: z.string().optional()
})

export type UploadDrawingForm = z.infer<typeof uploadDrawingFormSchema>;
export type GetUploadUrl = z.infer<typeof getUploadUrlSchema>;
export type UploadDrawing = z.infer<typeof uploadDrawingSchema>;
export type RejectDrawingForm = z.infer <typeof rejectDrawingSchema>;

export type GetUploadUrlSuccessResponse = SuccessResponse & {
    uploadUrl: string,
    fileKey: string
}

export type Drawing = {
    version: string | null;
    id: number;
    file_url: string;
    upload_type: "po" | "pi" | "drawing" | "general"
    title: string;
    deal_id: string | null;
    order_id: number | null;
    file_size: number;
    file_type: string;
    status: drawing_status;
    uploaded_at: Date;
    approved_at: Date | null;
    note: string | null;
    uploaded_by: number;
    show_in_order: boolean
}

export type GetDrawingOutput = {
    totalDrawing: number,
    drawings: Record<drawing_status, (Assignee & Drawing)[]>
}

export type GetDrawingSuccessResponse = SuccessResponse & GetDrawingOutput

export type GetDrawingByIdSuccessResponse = SuccessResponse & {
    viewUrl: string | null
}