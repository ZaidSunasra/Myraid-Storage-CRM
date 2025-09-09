import { Request, Response } from "express";
import { adddQuotationService, getQuotationProductsService } from "./quotation.service";
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
    const {
        quotation_template, product_type, bay, compartment, quotation_item, powder_coating, trolley_material, sheet_material, total_weight, labour_cost, installation,
        accomodation, transport, metal_rate, total, grandTotal, gst, discount, total_body, total_market_rate, total_provided_rate, round_off
    } = req.body;
    const deal_id = req.params.deal_id;
    const validation = addQuotationSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: "Input validation error",
            error: validation.error.issues
        })
    }
    try {
        await adddQuotationService({
            quotation_template, product_type, bay, compartment, quotation_item, powder_coating, trolley_material, sheet_material, total_weight, labour_cost, installation,
            accomodation, transport, metal_rate, total, grandTotal, gst, discount, total_body, total_market_rate, total_provided_rate, round_off
        }, deal_id);
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