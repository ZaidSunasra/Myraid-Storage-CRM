import { ErrorResponse, GetEmployeeSuccessResponse } from "zs-crm-common";
import { Request, Response } from "express";
import { getAllEmployeeService, getSalesEmployeeService } from "./employee.service";

export const getSalesEmployeeController = async (req: Request, res: Response<ErrorResponse | GetEmployeeSuccessResponse>): Promise<any> => {
    try {
        const employees = await getSalesEmployeeService();
        return res.status(200).json({
            message: "Employee fetched successfully",
            employees
        })
    } catch (error) {
        console.log("Error in fetching sales employee", error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const getAllEmployeeController = async (req: Request, res: Response<ErrorResponse | GetEmployeeSuccessResponse>): Promise<any> => {
    try {
        const employees = await getAllEmployeeService();
        return res.status(200).json({
            message: "Employee fetched successfully",
            employees
        })
    } catch (error) {
        console.log("Error in fetching all employee", error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}
