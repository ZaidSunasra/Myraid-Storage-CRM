import { Request, Response } from "express";
import { addLeadSchema } from "./lead.schema";
import { addLeadService, findExistingCompany, findExistingUser } from "./lead.service";
import { LeadErrorResponse, LeadSuccessResponse } from "./lead.types";

export const addLeadController = async (req: Request, res: Response<LeadErrorResponse | LeadSuccessResponse>): Promise<Response> => {
    const { first_name, last_name, phone, email, description, assigned_to, source, product, company_name, address, gst_no } = req.body;

    const validation = addLeadSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: "Input validation error",
            error: validation.error.issues
        })
    }
    try {
        const checkCompany = await findExistingCompany(company_name, gst_no, address);
        const checkEmail = await findExistingUser(email); 
        if (checkCompany) {
            return res.status(400).json({
                message: "Comapny detail already exists"
            })
        }
        if(checkEmail){
            return res.status(400).json({
                message: "Email already exists in lead",
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