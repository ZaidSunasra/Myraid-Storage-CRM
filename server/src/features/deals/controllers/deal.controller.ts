import { Request, Response } from "express";
import { convertLeadToDealService, editDealStatusService, getDealByCompanyService, getDealByIdService, getDealService } from "../services/deal.service";
import { ErrorResponse, SuccessResponse } from "zs-crm-common";

export const getDealController = async (req: Request, res: Response): Promise<any> => {
    const rows = parseInt(req.query.rows as string);
    const page = parseInt(req.query.page as string);
    try {
        const { deals, totalDeals } = await getDealService(rows, page);
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

export const getDealByCompanyController = async (req: Request, res: Response): Promise<any> => {
    const { company_id } = req.body;
    try {
        const deals = await getDealByCompanyService(company_id);
        return res.status(200).json({
            message: "Company deals fetched successfully",
            deals,
        });
    } catch (error) {
        console.log("Error in fetching comapny deals", error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const getDealByIdController = async (req: Request, res: Response): Promise<any> => {
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
    const author = res.locals.user;
    try {
        await convertLeadToDealService(lead_id, author);
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

export const editDealStatusController = async (req: Request, res: Response): Promise<any> => {
    const { id, status } = req.body();
    try {
        await editDealStatusService(id, status);
        return res.status(200).json({
            message: `Updated deal status succesfully`,
        });
    } catch (error) {
        console.log(`Error in updating deal status`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const addDealController = async (req: Request, res: Response): Promise<any> => {
    const { } = req.body;
    try {
    } catch (error) {

    }
};