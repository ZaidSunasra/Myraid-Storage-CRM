import { GetSourceSuccessResponse, ErrorResponse } from "zs-crm-common";
import { getSourcesService } from "./source.service";
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
