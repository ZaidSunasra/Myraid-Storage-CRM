import { Request, Response } from "express";
import { addClientService, editClientService, editCompanyDetailService, getCompaniesService, getCompanyEmployeeService } from "./company.service";
import { editClientSchema, editCompanyDetailSchema, ErrorResponse, GetCompanySuccessResponse, GetEmployeeByCompanySuccessResponse, SuccessResponse } from "zs-crm-common";

export const getCompaniesController = async (req: Request, res: Response<ErrorResponse | GetCompanySuccessResponse>): Promise<any> => {
    const name = req.query.name;
    try {
        const companies = await getCompaniesService(name as string);
        return res.status(200).json({
            message: `Companies fetched successfully`,
            companies
        })
    } catch (error) {
        console.log(`Error in fetching companies`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const getCompanyEmployeeController = async (req: Request, res: Response<GetEmployeeByCompanySuccessResponse | ErrorResponse>): Promise<any> => {
    const id = req.params.id;
    try {
        const employees = await getCompanyEmployeeService(id);
        return res.status(200).json({
            message: `Company employee fetched successfully`,
            employees
        })
    } catch (error) {
        console.log(`Error in fetching company employees`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const addClientController = async (req: Request, res: Response<SuccessResponse | ErrorResponse>): Promise<any> => {
    const { first_name, last_name, emails, phones } = req.body;
    const company_id = req.params.company_id;
    try {
        const validation = editClientSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                message: "Input validation error",
                error: validation.error.issues
            })
        }
        await addClientService({ first_name, last_name, emails, phones }, company_id);
        return res.status(200).json({
            message: `Client details added successfully`,
        })
    } catch (error) {
        console.log(`Error in adding client details`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const editClientController = async (req: Request, res: Response<SuccessResponse | ErrorResponse>): Promise<any> => {
    const { first_name, last_name, emails, phones, id} = req.body;
    const company_id = req.params.company_id;
    try {
        const validation = editClientSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                message: "Input validation error",
                error: validation.error.issues
            })
        }
        await editClientService({ first_name, last_name, emails, phones, id}, company_id);
        return res.status(200).json({
            message: `Client details edited successfully`,
        })
    } catch (error) {
        console.log(`Error in editing client details`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const editCompanyDetailsController =async (req: Request, res: Response<SuccessResponse | ErrorResponse>): Promise<any> => {
    const { company_name, gst_no, address} = req.body;
    const company_id = req.params.id;
    try {
        const validation = editCompanyDetailSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                message: "Input validation error",
                error: validation.error.issues
            })
        }
        await editCompanyDetailService({ company_name, gst_no, address}, company_id);
        return res.status(200).json({
            message: `Company details edited successfully`,
        })
    } catch (error) {
        console.log(`Error in editing company details`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}