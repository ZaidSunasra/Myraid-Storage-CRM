import { Request, Response } from "express";
import { getDescriptionsService, getDescriptionByIdService, addDescriptionService, editDescriptionService, deleteDescriptionService } from "./description.service.js";
import { ErrorResponse, SuccessResponse, GetDescriptionSuccessResponse, GetDescriptionByIdSuccessResponse } from "zs-crm-common";

export const getDescriptionsController = async (req: Request, res: Response<ErrorResponse | GetDescriptionSuccessResponse>): Promise<any> => {
    const id = req.params.ref_id;
    const type = req.query.type as "lead" | "deal";
    try {
        const descriptions = await getDescriptionsService(id, type);
        return res.status(200).json({
            message: `Description fetched successfully`,
            descriptions
        })
    } catch (error) {
        console.log(`Error in fetching description`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const getDescriptionByIdController = async (req: Request, res: Response<ErrorResponse | GetDescriptionByIdSuccessResponse>): Promise<any> => {
    const description_id = req.params.id;
    try {
        const description = await getDescriptionByIdService(description_id);
        return res.status(200).json({
            message: `Description with id:${description_id} fetched successfully`,
            description
        })
    } catch (error) {
        console.log(`Error in fetching description with id:${description_id}`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const addDescriptionController = async (req: Request, res: Response<ErrorResponse | SuccessResponse>): Promise<any> => {
    const id = req.params.id;
    const { description, type } = req.body;
    const author = res.locals.user;
    try {
        await addDescriptionService(id, description, author, type);
        return res.status(200).json({
            message: `Description added successfully`,
        })
    } catch (error) {
        console.log(`Error in adding description`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const editDescriptionController = async (req: Request, res: Response<ErrorResponse | SuccessResponse>): Promise<any> => {
    const description_id = req.params.id;
    const { description } = req.body;
    const author = res.locals.user;
    try {
        await editDescriptionService(description_id, description, author);
        return res.status(200).json({
            message: `Description edited successfully`
        })
    } catch (error) {
        console.log(`Error in editing description`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const deleteDescriptionController = async (req: Request, res: Response<ErrorResponse | SuccessResponse>): Promise<any> => {
    const description_id = req.params.id;
    try {
        await deleteDescriptionService(description_id);
        return res.status(200).json({
            message: `Description deleted successfully`,
        })
    } catch (error) {
        console.log(`Error in deleted description`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}
