import { Request, Response } from "express";
import { ErrorResponse, SuccessResponse, leadSchema,  GetLeadByIdSuccessResponse, GetLeadSuccessResponse, GetLeadByDurationSuccessResponse } from "zs-crm-common";
import { addLeadService, convertEmailIntoArray, editLeadService, findExistingCompany, findExistingEmail, findExistingGST, getLeadByDurationService, getLeadByIdService, getLeadsService } from "../services/lead.service";

export const addLeadController = async (req: Request, res: Response<ErrorResponse | SuccessResponse>): Promise<any> => {
    const { first_name, last_name, phones, emails, assigned_to, source_id, product_id, company_name, address, gst_no } = req.body;
    const author = res.locals.user;
    const validation = leadSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: "Input validation error",
            error: validation.error.issues
        })
    }
    try {
        const emailStrings = convertEmailIntoArray(emails);
        const checkCompany = await findExistingCompany(company_name, gst_no, address);
        if (checkCompany) {
            return res.status(400).json({
                message: "Comapny detail already exists"
            })
        }
        const checkEmail = await findExistingEmail(emailStrings);
        if (checkEmail) {
            return res.status(400).json({
                message: "Email already exists in lead"
            })
        }
        await addLeadService({ first_name, last_name, phones, emails, assigned_to, source_id, product_id, company_name, address, gst_no }, author);
        return res.status(200).json({
            message: "Lead generated successfully",
        })
    } catch (error) {
        console.log("Error in generating lead", error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const fetchAllLeadsController = async (req: Request, res: Response<ErrorResponse | GetLeadSuccessResponse>): Promise<any> => {
    const user = res.locals.user;
    const page = parseInt(req.query.page as string, 10) || 1;
    const rows = parseInt(req.query.rows as string, 10) || 10;
    const search = req.query.search as string;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    const employees = req.query.employeeID as string | undefined;
    const sources = req.query.sources as string | undefined;
    const employeeId = employees ? employees.split(",").filter(Boolean) : [];
    const sourceId = sources ? sources.split(",").filter(Boolean) : []
    try {
        const { leads, totalLeads } = await getLeadsService(user, page, search, employeeId, rows, startDate, endDate, sourceId);
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

export const editLeadController = async (req: Request, res: Response<ErrorResponse | SuccessResponse>): Promise<any> => {
    const lead_id = parseInt(req.params.id);
    const author = res.locals.user;
    const { first_name, last_name, phones, emails, assigned_to, source_id, product_id, company_name, address, gst_no } = req.body;
    const validation = leadSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: "Input validation error",
            error: validation.error.issues
        })
    }
    try {
        const emailStrings = convertEmailIntoArray(emails);
        const checkEmail = await findExistingEmail(emailStrings, lead_id);
        if (checkEmail) {
            return res.status(400).json({
                message: "Email already exists in another lead"
            })
        }
        const checkGST = await findExistingGST(lead_id, gst_no);
        if (checkGST) {
            return res.status(400).json({
                message: "GST number already associated with another company"
            });
        }
        await editLeadService({ id: lead_id, first_name, last_name, phones, emails, assigned_to, source_id, product_id, company_name, address, gst_no }, author)
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

export const fetchLeadByIdController = async (req: Request, res: Response<ErrorResponse | GetLeadByIdSuccessResponse>): Promise<any> => {
    const lead_id = req.params.id;
    try {
        const lead = await getLeadByIdService(lead_id);
        return res.status(200).json({
            message: `Lead with ID: ${lead_id} fetched successfully`,
            lead
        })
    } catch (error) {
        console.log(`Error in fetching lead with ID: ${lead_id}`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const fetchLeadsByDurationController = async (req: Request, res: Response<ErrorResponse | GetLeadByDurationSuccessResponse>): Promise<any> => {
    const duration = req.params.duration as "today" | "weekly" | "monthly" | "yearly" | "all";
    try {
        const { employeeLeadCount, totalLeads } = await getLeadByDurationService(duration);
        return res.status(200).json({
            message: `Leads by duration fetched successfully`,
            employeeLeadCount,
            totalLeads
        })
    } catch (error) {
        console.log(`Error in fetching leads data by duration`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}