import z from "zod/v4";
import { SuccessResponse } from "./common.schema";

export const DRAWING_VERSION = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "t", "U", "V", "W", "X", "Y", "Z"] as const;
export type drawing_version = typeof DRAWING_VERSION[number];

export const uploadDrawingFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    version: z.enum(DRAWING_VERSION),
    file: z.instanceof(File, { message: "File is required" }).nullable().refine(f => f !== null, { message: "File is required", }),
});

export const getUploadUrlSchema = z.object({
    fileName: z.string().min(1, "File Name is required"),
    fileType: z.string().min(1, "Type is required")
});

export const uploadDrawingSchema = z.object({
    drawing_url: z.string().min(1, "URL is required"),
    title: z.string().min(1, "Title is required"),
    version: z.enum(DRAWING_VERSION),
    deal_id: z.string().min(1, "Deal Id is required"),
    file_size: z.coerce.number(),
    file_type: z.string().min(1, "File type is required")
});

export type UploadDrawingForm = z.infer<typeof uploadDrawingFormSchema>;
export type GetUploadUrl = z.infer<typeof getUploadUrlSchema>;
export type UploadDrawing = z.infer<typeof uploadDrawingSchema>;

export type GetUploadUrlSuccessResponse =SuccessResponse  & {
    uploadUrl: string,
    fileKey: string
}

