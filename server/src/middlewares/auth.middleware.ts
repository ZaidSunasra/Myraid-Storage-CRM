import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<any> => {

    try {
        const token = req.cookies?.Token;
        if (!token) {
            return res.status(401).send({
                message: "Unauthorized: No token provided"
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
            email: string,
            department: string,
            id: number
        }
        if (!decoded.email || !decoded.id || !decoded.department) {
            return res.status(401).send({
                message: "Unauthorized: Invalid token"
            });
        }
        res.locals.user = {
            id: decoded.id,
            department: decoded.department,
            email: decoded.email
        };
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                message: "Token expired"
            });
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                message: "Invalid token"
            });
        }
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export default authMiddleware;