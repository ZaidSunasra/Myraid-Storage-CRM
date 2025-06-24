import { Request, Response } from "express";
import { leadSchema } from "zs-crm-common";
import { addLeadService, editLeadService, findExistingCompany, findExistingEmail, findExistingGST, getLeadsService } from "./lead.service";
import { LeadErrorResponse, AddLeadSuccessResponse, FetchLeadSuccessResponse, LeadSuccessResponse } from "./lead.types";

export const addLeadController = async (req: Request, res: Response<LeadErrorResponse | AddLeadSuccessResponse>): Promise<any> => {
    const { first_name, last_name, phone, email, description, assigned_to, source, product, company_name, address, gst_no } = req.body;

    const validation = leadSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: "Input validation error",
            error: validation.error.issues
        })
    }
    try {
        const checkCompany = await findExistingCompany(company_name, gst_no, address);
        const checkEmail = await findExistingEmail(email);
        if (checkCompany) {
            return res.status(400).json({
                message: "Comapny detail already exists"
            })
        }
        if (checkEmail) {
            return res.status(400).json({
                message: "Email already exists in lead"
            })
        }
        const lead_id = await addLeadService({ first_name, last_name, phone, email, description, assigned_to, source, product, company_name, address, gst_no });
        return res.status(200).json({
            message: "Lead generated successfully",
            id: lead_id
        })
    } catch (error) {
        console.log("Error in generating lead", error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const fetchAllLeadsController = async (req: Request, res: Response<LeadErrorResponse | FetchLeadSuccessResponse>): Promise<any> => {

    const user = res.locals.user;

    try {
        const leads = await getLeadsService(user);
        return res.status(200).json({
            message: "Leads fetched successfully",
            leads
        })
    } catch (error) {
        console.log("Error in fetching lead", error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const editLeadController = async (req: Request, res: Response<LeadErrorResponse | LeadSuccessResponse>): Promise<any> => {

    const id = parseInt(req.params.id);
    const { first_name, last_name, phone, email, description, assigned_to, source, product, company_name, address, gst_no } = req.body;

    const validation = leadSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: "Input validation error",
            error: validation.error.issues
        })
    }
    try {
        const checkEmail = await findExistingEmail(email, id);
        if (checkEmail) {
            return res.status(400).json({
                message: "Email already exists in another lead"
            })
        }
        const checkGST = await findExistingGST(id, gst_no);
        if (checkGST) {
            return res.status(400).json({
                message: "GST number already associated with another company"
            });
        }
        await editLeadService({ id, first_name, last_name, phone, email, description, assigned_to, source, product, company_name, address, gst_no })
        return res.status(200).json({
            message: "Lead edited successfully"
        })
    } catch (error) {
        console.log("Error in editing lead", error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}