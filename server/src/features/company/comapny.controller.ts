import { Request, Response } from "express";
import { getCompaniesService, getCompanyEmployeeService } from "./company.service";
import { ErrorResponse, GetCompanySuccessResponse, GetEmployeeByCompanySuccessResponse } from "zs-crm-common";

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