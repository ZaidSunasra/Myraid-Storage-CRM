import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { loginSchema, signupSchema } from "./auth.schema";
import { addUser, comparePassword, findExistingUser, hashPassword } from "./auth.service";
import { cookieOptions } from "../../utils/constant";
import { LoginFailureResponse, LoginSuccessResponse, SignupResponse } from "./auth.types";

export const loginController = async (req: Request, res: Response<LoginSuccessResponse | LoginFailureResponse>): Promise<any> => {

    const { email, password } = req.body;

    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: "Input validation error",
            error: validation.error.issues
        })
    }
    try {
        const user = await findExistingUser(email);
        if (!user) {
            return res.status(400).json({
                message: "Email not found. Enter correct email",
            });
        }
        const verifyPassword = await comparePassword(password, user.password);
        if (!verifyPassword) {
            return res.status(400).json({
                message: "Incorrect password",
            });
        }
        const token = jwt.sign(
            {
                email: email,
                id: user.id,
                department: user.department
            },
            process.env.JWT_SECRET as string,
            { expiresIn: "1d" }
        );
        res.cookie("Token", token, cookieOptions)
        return res.status(200).json({
            message: "Login successful",
            userData: {
                department: user.department,
                name: user.first_name + " " + user.last_name,
                email: user.email,
                code: user.quotation_code
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error
        });
    }
}

export const signupController = async (req: Request, res: Response<SignupResponse>): Promise<any> => {

    const { email, password, phone, first_name, last_name, quotation_code, department } = req.body;

    const validation = signupSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: "Input validation error",
            error: validation.error.issues
        })
    }
    try {
        const isEmailAvailable = await findExistingUser(email);
        if (isEmailAvailable) {
            return res.status(400).json({
                message: "Email already registered",
            })
        }
        await addUser({ first_name, last_name, email, phone, password, quotation_code, department })
        return res.status(200).json({
            message: "Account created successfully",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            error: error
        });
    }
}

export const logoutController = async (req: Request, res: Response): Promise<any> => {
    try {
        res.clearCookie("Token");
        return res.status(200).send({
            message: "Logout successful",
        });
    } catch (error) {
        return res.status(500).send({
            message: "Internal server error",
        });
    }
}