import { Request, Response } from "express";
import { ErrorResponse, getUploadUrlSchema, GetUploadUrlSuccessResponse, SuccessResponse, uploadDrawingSchema } from "zs-crm-common";
import { getDrawingsService, getUploadUrlService, uploadDrawingService } from "../services/drawing.service";

export const getUploadUrlController = async (req: Request, res: Response<ErrorResponse | GetUploadUrlSuccessResponse>): Promise<any> => {
    const { fileName, fileType } = req.body;
    const fileKey = `${Date.now()}-${fileName}`;
    const validation = getUploadUrlSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: "Input validation error",
            error: validation.error.issues
        })
    }
    try {
        const uploadUrl = await getUploadUrlService(fileKey, fileType);
        return res.status(200).json({
            message: "Upload url fetched successfully",
            uploadUrl,
            fileKey
        });
    } catch (error) {
        console.log(`Error in fetching upload URL`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const uploadDrawingController = async (req: Request, res: Response<SuccessResponse | ErrorResponse>): Promise<any> => {
    const { drawing_url, title, version, deal_id, file_size, file_type} = req.body;
    const author = res.locals.user;
    const validation = uploadDrawingSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: "Input validation error",
            error: validation.error.issues
        })
    }
    try {
        await uploadDrawingService({drawing_url, title, version, deal_id, file_size, file_type}, author);
        return res.status(200).json({
            message: "Drawing uploaded successfully"
        });
    } catch (error) {
        console.log(`Error in uploading drawing`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const getDrawingsController = async (req: Request, res: Response) : Promise<any> => {
    const deal_id = req.params.deal_id;
    const author = res.locals.user;
    try {
        const drawings = await getDrawingsService(deal_id, author);
        return res.status(200).json({
            message: "Drawing fetched successfully",
            drawings
        });
    } catch (error) {
        console.log(`Error in fetching drawing`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}