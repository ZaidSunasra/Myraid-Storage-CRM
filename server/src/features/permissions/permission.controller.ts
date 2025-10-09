import { Request, Response } from "express";
import { editPermissionService, getPermissionsService } from "./permission.service";
import { ErrorResponse, GetPermissionSuccessResponse, SuccessResponse } from "zs-crm-common";

export const getPermissionsController = async (req: Request, res: Response<ErrorResponse | GetPermissionSuccessResponse>): Promise<any> => {
    try {
        const permissions = await getPermissionsService();
        return res.status(200).json({
            message: `Permissions fetched successfully`,
            permissions
        })
    } catch (error) {
        console.log(`Error in fetching permissions`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const editPermissionController = async (req: Request, res: Response<SuccessResponse | ErrorResponse>): Promise<any> => {
    const { allowed_dept } = req.body;
    const id = req.params.id;
    try {
        await editPermissionService(allowed_dept, id);
        return res.status(200).json({
            message: `Permissions edited successfully`,
        })
    } catch (error) {
        console.log(`Error in editing permissions`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}