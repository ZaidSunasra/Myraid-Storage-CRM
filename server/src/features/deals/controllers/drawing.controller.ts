import { Request, Response } from "express";
import { ErrorResponse, GetDrawingByIdSuccessResponse, GetDrawingSuccessResponse, getUploadUrlSchema, GetUploadUrlSuccessResponse, SuccessResponse, uploadDrawingSchema } from "zs-crm-common";
import { approveDrawingService, deleteDrawingService, getDrawingByIdService, getDrawingsService, getUploadUrlService, rejectDrawingService, uploadDrawingService } from "../services/drawing.service";

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
    const { drawing_url, title, version, deal_id, file_size, file_type } = req.body;
    const author = res.locals.user;
    const validation = uploadDrawingSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: "Input validation error",
            error: validation.error.issues
        })
    }
    try {
        await uploadDrawingService({ drawing_url, title, version, deal_id, file_size, file_type }, author);
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

export const getDrawingsController = async (req: Request, res: Response<ErrorResponse | GetDrawingSuccessResponse>): Promise<any> => {
    const deal_id = req.params.deal_id;
    const author = res.locals.user;
    try {
        const { drawings, totalDrawing } = await getDrawingsService(deal_id, author);
        return res.status(200).json({
            message: "Drawing fetched successfully",
            drawings,
            totalDrawing
        });
    } catch (error) {
        console.log(`Error in fetching drawing`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const getDrawingByIdController = async (req: Request, res: Response<ErrorResponse | GetDrawingByIdSuccessResponse>): Promise<any> => {
    const id = req.params.id;
    try {
        const viewUrl = await getDrawingByIdService(id)
        return res.status(200).json({
            message: "View URL fetchrd successfully",
            viewUrl
        });
    } catch (error) {
        console.log(`Error in fetching view URL`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const deleteDrawingController = async (req: Request, res: Response<SuccessResponse | ErrorResponse>): Promise<any> => {
    const id = req.params.id;
    try {
        await deleteDrawingService(id);
        return res.status(200).json({
            message: "Drawing deleted successfully",
        });
    } catch (error) {
        console.log(`Error in deleting drawing`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const approveDrawingController = async (req: Request, res: Response<SuccessResponse | ErrorResponse>): Promise<any> => {
    const id = req.params.id;
    const author = res.locals.user;
    try {
        await approveDrawingService(id, author);
        return res.status(200).json({
            message: "Drawing  approved successfully",
        });
    } catch (error) {
        console.log(`Error in approving drawing`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}


export const rejectDrawingController = async (req: Request, res: Response<SuccessResponse | ErrorResponse>): Promise<any> => {
    const id = req.params.id;
    const author = res.locals.user;
    const { note } = req.body;
    try {
        await rejectDrawingService(id, author, note);
        return res.status(200).json({
            message: "Drawing  rejected successfully",
        });
    } catch (error) {
        console.log(`Error in rejecting drawing`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}