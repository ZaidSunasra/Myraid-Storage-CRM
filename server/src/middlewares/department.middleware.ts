import { NextFunction, Request, RequestHandler, Response } from "express";

const checkDepartment = (allowedDepartment: string[]): RequestHandler => {

    return (req: Request, res: Response, next: NextFunction): any => {
        if (!res.locals.user || !allowedDepartment.includes(res.locals.user.department)) {
           return res.status(403).json({
                message: "Access denied. You do not have the required permissions.",
            });
        }
        next();
    } 
}

export default checkDepartment;