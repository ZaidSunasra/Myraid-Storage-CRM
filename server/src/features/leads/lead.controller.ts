import { Request, Response } from "express";
import { LeadErrorResponse, AddLeadSuccessResponse, LeadSuccessResponse, addReminderSchema, leadSchema } from "zs-crm-common";
import { addDescriptionService, addLeadService, addReminderService, convertEmailIntoArray, deleteReminderService, editLeadService, fetchEmployeeService, findExistingCompany, findExistingEmail, findExistingGST, getLeadByDurationService, getLeadByIdService, getLeadsService, getProductsService, getRemindersService, getSourcesService } from "./lead.service";
import { FetchEmployeeSuccessResponse, FetchLeadByIdSuccessResponse, FetchLeadSuccessResponse, FetchReminderSuccessResponse } from "./lead.types";

export const addLeadController = async (req: Request, res: Response<LeadErrorResponse | AddLeadSuccessResponse>): Promise<any> => {
    const { first_name, last_name, phones, emails, description, assigned_to, source_id, product_id, company_name, address, gst_no } = req.body;
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
        const lead_id = await addLeadService({ first_name, last_name, phones, emails, description, assigned_to, source_id, product_id, company_name, address, gst_no });
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

export const editLeadController = async (req: Request, res: Response<LeadErrorResponse | LeadSuccessResponse>): Promise<any> => {
    const id = parseInt(req.params.id);
    const { first_name, last_name, phones, emails, description, assigned_to, source_id, product_id, company_name, address, gst_no } = req.body;
    const validation = leadSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: "Input validation error",
            error: validation.error.issues
        })
    }
    try {
        const emailStrings = convertEmailIntoArray(emails);
        const checkEmail = await findExistingEmail(emailStrings, id);
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
        await editLeadService({ id, first_name, last_name, phones, emails, description, assigned_to, source_id, product_id, company_name, address, gst_no })
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

export const fetchLeadByIdController = async (req: Request, res: Response<LeadErrorResponse | FetchLeadByIdSuccessResponse>): Promise<any> => {
    const id = req.params.id;
    try {
        const lead = await getLeadByIdService(id);
        return res.status(200).json({
            message: `Lead with ID: ${id} fetched successfully`,
            lead
        })
    } catch (error) {
        console.log(`Error in fetching lead with ID: ${id}`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const addDescriptionController = async (req: Request, res: Response<LeadSuccessResponse | LeadErrorResponse>): Promise<any> => {
    const id = req.params.id;
    const { description } = req.body;
    try {
        await addDescriptionService(id, description);
        return res.status(200).json({
            message: `Description added successfully`,
        })
    } catch (error) {
        console.log(`Error in adding description`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const addReminderController = async (req: Request, res: Response<LeadSuccessResponse | LeadErrorResponse>): Promise<any> => {
    const { title, send_at, message, related_id, reminder_type, related_type } = req.body;
    const id = res.locals.user.id
    const validation = addReminderSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: "Input validation error",
            error: validation.error.issues
        })
    }
    try {
        await addReminderService({ title, send_at, message, related_id, reminder_type, related_type }, id)
        return res.status(200).json({
            message: `Reminder added successfully`,
        })
    } catch (error) {
        console.log(`Error in adding reminder`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const fetchRemindersController = async (req: Request, res: Response<FetchReminderSuccessResponse | LeadErrorResponse>): Promise<any> => {
    const id = req.params.id;
    try {
        const reminders = await getRemindersService(id);
        return res.status(200).json({
            message: `Reminder fetched successfully`,
            reminders
        })
    } catch (error) {
        console.log(`Error in fetching reminder`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const deleteReminderController = async (req: Request, res: Response<LeadSuccessResponse | LeadErrorResponse>): Promise<any> => {
    const id = req.params.id;
    try {
        await deleteReminderService(id);
        return res.status(200).json({
            message: `Reminder deleted successfully`,
        })
    } catch (error) {
        console.log(`Error in deleting reminder`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const getProductsController = async (req: Request, res: Response): Promise<any> => {
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

export const getSourcesController = async (req: Request, res: Response): Promise<any> => {
    try {
        const sources = await getSourcesService();
        return res.status(200).json({
            message: `Sources fetched successfully`,
            sources
        })
    } catch (error) {
        console.log(`Error in fetching sources`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const fetchLeadsByDurationController = async (req: Request, res: Response): Promise<any> => {

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