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
    fileName: z.string(),
    fileKey: z.string()
});

export const uploadDrawingSchema = z.object({
    drawing_url: z.string(),
    title: z.string(),
    version: z.enum(DRAWING_VERSION),
    deal_id: z.string()
});

export type UploadDrawingForm = z.infer<typeof uploadDrawingFormSchema>;
export type GetUploadUrl = z.infer<typeof getUploadUrlSchema>;
export type UploadDrawing = z.infer<typeof uploadDrawingSchema>;

export type GetUploadUrlSuccessResponse =SuccessResponse  & {
    uploadUrl: string,
    fileKey: string
}

