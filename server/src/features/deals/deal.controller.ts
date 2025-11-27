import { Request, Response } from "express";
import { addDealService, getDealIdService, convertLeadToDealService, editDealService, editDealStatusService, getDealByCompanyService, getDealByIdService, getDealService } from "./deal.service.js";
import { GetAllDealSuccessResponse, GetDealByIdSuccessResponse, GetDealByompanySuccessResponse, ErrorResponse, SuccessResponse, editStatusSchema, dealSchema, GetOnlyDealSuccessResponse } from "zs-crm-common";

export const getDealController = async (req: Request, res: Response<ErrorResponse | GetAllDealSuccessResponse>): Promise<any> => {
    const user = res.locals.user;
    const rows = parseInt(req.query.rows as string);
    const page = parseInt(req.query.page as string);
    const search = req.query.search as string;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    const employees = req.query.employeeID as string | undefined;
    const sources = req.query.sources as string | undefined;
    const employeeId = employees ? employees.split(",").filter(Boolean) : [];
    const sourceId = sources ? sources.split(",").filter(Boolean) : []
    try {
        const { deals, totalDeals } = await getDealService(user, rows, page, search, startDate, endDate, employeeId, sourceId);
        return res.status(200).json({
            message: "Deals fetched successfully",
            deals,
            totalDeals
        });
    } catch (error) {
        console.log("Error in fetching deals", error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const getDealByCompanyController = async (req: Request, res: Response<ErrorResponse | GetDealByompanySuccessResponse>): Promise<any> => {
    const { company_id } = req.body;
    try {
        const deals = await getDealByCompanyService(company_id);
        return res.status(200).json({
            message: "Company deals fetched successfully",
            deals,
        });
    } catch (error) {
        console.log("Error in fetching company deals", error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const getDealByIdController = async (req: Request, res: Response<ErrorResponse | GetDealByIdSuccessResponse>): Promise<any> => {
    const id = req.params.id;
    try {
        const deal = await getDealByIdService(id);
        return res.status(200).json({
            message: `Deal with Id:${id} fetched successfully`,
            deal,
        });
    } catch (error) {
        console.log(`Error in fetching deal with Id:${id}`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const convertLeadToDealController = async (req: Request, res: Response<ErrorResponse | SuccessResponse>): Promise<any> => {
    const lead_id = req.params.lead_id;
    const { quotation_code } = req.body;
    const author = res.locals.user;
    try {
        await convertLeadToDealService(lead_id, author, quotation_code);
        return res.status(200).json({
            message: "Lead converted to deal successfully",
        });
    } catch (error) {
        console.log("Erro in converting lead to deal", error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const editDealStatusController = async (req: Request, res: Response<SuccessResponse | ErrorResponse>): Promise<any> => {
    const { status } = req.body;
    const deal_id = req.params.id;
    const validation = editStatusSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: "Input validation error",
            error: validation.error.issues
        })
    }
    try {
        await editDealStatusService(deal_id, status);
        return res.status(200).json({
            message: `Deal status updated succesfully`,
        });
    } catch (error) {
        console.log(`Error in updating deal status`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const addDealController = async (req: Request, res: Response<SuccessResponse | ErrorResponse>): Promise<any> => {
    const { company_id, employee_id, source_id, product_id, assigned_to, deal_status } = req.body;
    const author = res.locals.user;
    const validation = dealSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: "Input validation error",
            error: validation.error.issues
        })
    }
    try {
        await addDealService({ company_id, employee_id, source_id, product_id, assigned_to, deal_status }, author)
        return res.status(200).json({
            message: `Deal added succesfully`,
        });
    } catch (error) {
        console.log(`Error in adding deal`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
};

export const editDealController = async (req: Request, res: Response<SuccessResponse | ErrorResponse>): Promise<any> => {
    const { company_id, employee_id, source_id, product_id, assigned_to, deal_status } = req.body;
    const deal_id = req.params.id;
    const author = res.locals.user;
    const validation = dealSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: "Input validation error",
            error: validation.error.issues
        })
    }
    try {
        await editDealService({ company_id, employee_id, source_id, product_id, assigned_to, deal_status }, deal_id, author)
        return res.status(200).json({
            message: `Deal edited succesfully`,
        });
    } catch (error) {
        console.log(`Error in editing deal`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const getDealIdController = async (req: Request, res: Response<ErrorResponse | GetOnlyDealSuccessResponse>): Promise<any> => {
    const author = res.locals.user;
    try {
        const dealIds = await getDealIdService(author);
        return res.status(200).json({
            message: `Deal Ids  fetched succesfully`,
            dealIds
        });
    } catch (error) {
        console.log(`Error in fetching deal Ids`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}