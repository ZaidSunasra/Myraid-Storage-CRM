import { Request, Response } from "express";
import { LeadErrorResponse, AddLeadSuccessResponse, leadSchema, LeadSuccessResponse } from "zs-crm-common";
import { addLeadService, editLeadService, fetchEmployeeService, findExistingCompany, findExistingEmail, findExistingGST, getLeadsService } from "./lead.service";
import { FetchEmployeeSuccessResponse, FetchLeadSuccessResponse } from "./lead.types";

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
    const page = parseInt(req.query.page as string, 10) || 1;
    const search = req.query.search;
    const employeeId = req.query.employeeID as string | undefined;
    const id = employeeId ? employeeId.split(",").filter(Boolean)  : [];

    try {
        const { leads, totalLeads } = await getLeadsService(user, page, search, id);
        return res.status(200).json({
            message: "Leads fetched successfully",
            leads,
            totalLeads
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

export const fetchEmployeeController = async (req: Request, res: Response<LeadErrorResponse | FetchEmployeeSuccessResponse>): Promise<any> => {
    try {
        const employees = await fetchEmployeeService();
        return res.status(200).json({
            message: "Employee fetched successfully",
            employees
        })
    } catch (error) {
        console.log("Error in fetching employee", error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}