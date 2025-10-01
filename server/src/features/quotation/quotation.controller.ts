import { Request, Response } from "express";
import { adddQuotationService, editQuotationService, getQuotationByDealService, getQuotationByIdService, getQuotationProductsService, getQuotationService } from "./quotation.service";
import { addQuotationSchema, ErrorResponse, GetQuotationByDealSuccessResponse, GetQuotationByIdSuccessResponse, GetQuotationSuccessResponse, QuotationBaseProductSuccessResponse, SuccessResponse } from "zs-crm-common";

export const getQuotationProductsController = async (req: Request, res: Response<ErrorResponse | QuotationBaseProductSuccessResponse>): Promise<any> => {
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
    const { quotation_template, quotation_item, total, grandTotal, gst, discount, round_off, show_body_table, note} = req.body;
    const deal_id = req.params.deal_id;
    const validation = addQuotationSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: "Input validation error",
            error: validation.error.issues
        })
    }
    try {
        await adddQuotationService({ quotation_template, quotation_item, total, grandTotal, gst, discount, round_off, show_body_table, note }, deal_id);
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

export const getQuotationByDealController = async (req: Request, res: Response<ErrorResponse | GetQuotationByDealSuccessResponse>): Promise<any> => {
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

export const getQuotationController = async (req: Request, res: Response<ErrorResponse | GetQuotationSuccessResponse>): Promise<any> => {
    const user = res.locals.user;
    const page = parseInt(req.query.page as string, 10) || 1;
    const rows = parseInt(req.query.rows as string, 10) || 10;
    const search = req.query.search as string;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    const employees = req.query.employeeID as string | undefined;
    const employeeId = employees ? employees.split(",").filter(Boolean) : [];
    try {
        const quotations = await getQuotationService(user, page, search, employeeId, rows, startDate, endDate);
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

export const getQuotationByIdController = async (req: Request, res: Response<GetQuotationByIdSuccessResponse | ErrorResponse>): Promise<any> => {
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

export const editQuotationController = async (req: Request, res: Response<ErrorResponse | SuccessResponse>): Promise<any> => {
    const { quotation_template, quotation_item, total, grandTotal, gst, discount, round_off, show_body_table, note } = req.body;
    const deal_id = req.params.deal_id;
    const id = req.params.id;
    const validation = addQuotationSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: "Input validation error",
            error: validation.error.issues
        })
    }
    try {
        await editQuotationService({ quotation_template, quotation_item, total, grandTotal, gst, discount, round_off, show_body_table, note }, deal_id, id);
        return res.status(200).json({
            message: `Quotation edited  successfully`,
        })
    } catch (error) {
        console.log(`Error in editing quotation`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}