import { Request, Response } from "express";
import { adddQuotationService, getQuotationByDealService, getQuotationByIdService, getQuotationProductsService, getQuotationService } from "./quotation.service";
import { addQuotationSchema, ErrorResponse, SuccessResponse } from "zs-crm-common";

export const getQuotationProductsController = async (req: Request, res: Response): Promise<any> => {
    const { product_type, bay, compartment } = req.body;
    try {
        const products = await getQuotationProductsService(product_type, bay, compartment);
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

export const addQuotationController = async (req: Request, res: Response<ErrorResponse | SuccessResponse>): Promise<any> => {
    const { quotation_template, product_type, bay, compartment, quotation_item, total, grandTotal, gst, discount, round_off, show_body_table } = req.body;
    const deal_id = req.params.deal_id;
    const validation = addQuotationSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: "Input validation error",
            error: validation.error.issues
        })
    }
    try {
        await adddQuotationService({ quotation_template, product_type, bay, compartment, quotation_item, total, grandTotal, gst, discount, round_off, show_body_table }, deal_id);
        return res.status(200).json({
            message: `Quotation added  successfully`,
        })
    } catch (error) {
        console.log(`Error in adding quotations`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const getQuotationByDealController = async (req: Request, res: Response): Promise<any> => {
    const deal_id = req.params.deal_id;
    try {
        const quotations = await getQuotationByDealService(deal_id);
        return res.status(200).json({
            message: `Quotations by deal fetched  successfully`,
            quotations
        })
    } catch (error) {
        console.log(`Error in fetching quotations by deal`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const getQuotationController = async (req: Request, res: Response): Promise<any> => {
    try {
        const quotations = await getQuotationService();
        return res.status(200).json({
            message: `Quotations fetched  successfully`,
            quotations
        })
    } catch (error) {
        console.log(`Error in fetching quotations`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const getQuotationByIdController = async (req: Request, res: Response): Promise<any> => {
    const id = req.params.id;
    try {
        const quotation = await getQuotationByIdService(id)
        return res.status(200).json({
            message: `Quotation with Id:${id} fetched successfully`,
            quotation
        })
    } catch (error) {
        console.log(`Error in fetching quotation with Id:${id}`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}