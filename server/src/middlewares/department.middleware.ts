import { NextFunction, Request, RequestHandler, Response } from "express";
import { prisma } from "../libs/prisma";

const checkDepartment = (allowedDepartment?: string[], permissionKey?: string): RequestHandler => {

    return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const user = res.locals.user;

            if (allowedDepartment) {
                if (allowedDepartment.includes(user.department)) return next();
                return res.status(403).json({
                    message: "Access denied: department not allowed"
                });
            }

            if (permissionKey) {
                const permission = await prisma.permission.findFirst({
                    where: { permission_key: permissionKey },
                });

                if (!permission) {
                    return res.status(404).json({ message: "Permission not found" });
                }

                if (permission.allowed_dept.includes(user.department)) {
                    return next();
                }

                return res.status(403).json({ message: "Access denied: permission not allowed" });
            }
            return res.status(403).json({ message: "No permission configuration found" });
        } catch (error) {
            console.error("Error checking permission:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    };
}


export default checkDepartment;