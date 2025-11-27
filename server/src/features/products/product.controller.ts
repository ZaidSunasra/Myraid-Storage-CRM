import { Request, Response } from "express";
import { addProductService, editProductService, getProductsService } from "./product.service.js";
import { GetProductSuccessResponse, ErrorResponse, SuccessResponse } from "zs-crm-common";

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

export const addProductsController = async (req: Request, res: Response<ErrorResponse | SuccessResponse>): Promise<any> => {
    const { name } = req.body;
    try {
        await addProductService(name);
        return res.status(200).json({
            message: `Product added successfully`,
        })
    } catch (error) {
        console.log(`Error in adding products`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const editProductController = async (req: Request, res: Response<ErrorResponse | SuccessResponse>): Promise<any> => {
    const {name} = req.body;
    const id = req.params.id;
    try {
        await editProductService(name, id);
        return res.status(200).json({
            message: `Product edited successfully`,
        })
    } catch (error) {
        console.log(`Error in editing products`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}
