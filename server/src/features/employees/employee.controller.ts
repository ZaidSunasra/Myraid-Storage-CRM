import { ErrorResponse, GetAllEmployeeSuccessResponse, GetEmployeeSuccessResponse } from "zs-crm-common";
import { Request, Response } from "express";
import { getAllEmployeeService, getAssignedEmployeeService, getSalesEmployeeService } from "./employee.service.js";

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

export const getAllEmployeeController = async (req: Request, res: Response<ErrorResponse | GetAllEmployeeSuccessResponse>): Promise<any> => {
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

export const getAssignedEmployeeController = async (req: Request, res: Response<ErrorResponse | GetEmployeeSuccessResponse>): Promise<any> => {
    const ref_id = req.params.id;
    const type = req.query.type;
    try {
        const employees = await getAssignedEmployeeService(ref_id, type as "deal" | "lead");
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
