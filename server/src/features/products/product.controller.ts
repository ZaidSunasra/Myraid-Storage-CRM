import { Request, Response } from "express";
import { getProductsService } from "./product.service";
import { GetProductSuccessResponse, ErrorResponse } from "zs-crm-common";

export const getProductsController = async (req: Request, res: Response<ErrorResponse | GetProductSuccessResponse>): Promise<any> => {
    try {
        const products = await getProductsService();
        return res.status(200).json({
            message: `Products fetched successfully`,
            products
        })
    } catch (error) {
        console.log(`Error in fetching products`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}
