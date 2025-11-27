import { GetSourceSuccessResponse, ErrorResponse, SuccessResponse } from "zs-crm-common";
import { addSourceService, editSourceService, getSourcesService } from "./source.service.js";
import { Request, Response } from "express";

export const getSourcesController = async (req: Request, res: Response<ErrorResponse | GetSourceSuccessResponse>): Promise<any> => {
    try {
        const sources = await getSourcesService();
        return res.status(200).json({
            message: `Sources fetched successfully`,
            sources
        })
    } catch (error) {
        console.log(`Error in fetching sources`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const addSourceController = async (req: Request, res: Response<ErrorResponse | SuccessResponse>): Promise<any> => {
    const { name } = req.body;
    try {
        await addSourceService(name);
        return res.status(200).json({
            message: `Source added successfully`,
        })
    } catch (error) {
        console.log(`Error in adding source`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const editSourceController = async (req: Request, res: Response<ErrorResponse | SuccessResponse>): Promise<any> => {
    const { name } = req.body;
    const id = req.params.id;
    try {
        await editSourceService(name, id);
        return res.status(200).json({
            message: `Source edited successfully`,
        })
    } catch (error) {
        console.log(`Error in editing source`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

