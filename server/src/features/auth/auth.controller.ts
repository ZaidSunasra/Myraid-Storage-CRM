import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { loginSchema, signupSchema, LoginSuccessResponse, SignupResponse, ErrorResponse, SuccessResponse, editUserSchema, department, changePasswordSchema, GetUserDetailSuccessResponse } from "zs-crm-common";
import { addUser, changePasswordService, comparePassword, editUserService, findExistingEmail, findExistingPhone, getUserDetailService, hashPassword, resetPasswordService } from "./auth.service";
import { cookieOptions } from "../../utils/constant";

export const loginController = async (req: Request, res: Response<LoginSuccessResponse | ErrorResponse>): Promise<any> => {

    const { email, password } = req.body;

    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: "Input validation error",
            error: validation.error.issues
        })
    }
    try {
        const user = await findExistingEmail(email);
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
                department: user.department,
                name: user.first_name + " " + user.last_name
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
                code: user.quotation_code,
                id: user.id
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
        const isEmailAvailable = await findExistingEmail(email);
        const isPhoneAvailable = await findExistingPhone(phone);
        if (isPhoneAvailable || isEmailAvailable) {
            return res.status(400).json({
                message: isEmailAvailable ? "Email already registered" : "Phone already registered",
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

export const logoutController = (req: Request, res: Response<SuccessResponse>): any => {
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

export const editUserController = async (req: Request, res: Response<SignupResponse>): Promise<any> => {

    const user_id = req.params.user_id;
    const { email, phone, first_name, last_name, quotation_code, department } = req.body;

    const validation = editUserSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: "Input validation error",
            error: validation.error.issues
        })
    }
    try {
        const isEmailAvailable = await findExistingEmail(email, parseInt(user_id));
        const isPhoneAvailable = await findExistingPhone(email, parseInt(user_id));
        if (isPhoneAvailable || isEmailAvailable) {
            return res.status(400).json({
                message: isEmailAvailable ? "Email already registered" : "Phone already registered",
            })
        }
        await editUserService({ first_name, last_name, email, phone, quotation_code, department }, user_id);
        return res.status(200).json({
            message: "User details edited successfully",
        })
    } catch (error) {
        console.log("Error in editing user details", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error
        });
    }
}

export const changePasswordController = async (req: Request, res: Response<SuccessResponse | ErrorResponse>): Promise<any> => {
    const { old_password, new_password } = req.body;
    const user = res.locals.user;
    const validation = changePasswordSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: "Input validation error",
            error: validation.error.issues
        })
    }
    try {
        const userData = await findExistingEmail(user.email);
        if (!userData) {
            return res.status(400).json({
                message: "User not found.",
            });
        }
        const verifyPassword = await comparePassword(old_password, userData.password);
        if (!verifyPassword) {
            return res.status(400).json({
                message: "Incorrect password. Enter correct password",
            });
        }
        const hashedPassword = await hashPassword(new_password);
        await changePasswordService(hashedPassword, user);
        return res.status(200).json({
            message: "Password changed successfully",
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error
        });
    }
}

export const resetPasswordController = async (req: Request, res: Response<SuccessResponse | ErrorResponse>): Promise<any> => {
    const user_id = req.params.id;

    try {
        const password = await hashPassword("123456");
        await resetPasswordService(password, user_id as string)
        return res.status(200).json({
            message: "Password reset successfully",
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error
        });
    }
}

export const getUserDetailController = async (req: Request, res: Response<ErrorResponse | GetUserDetailSuccessResponse>): Promise<any> => {
    const user = res.locals.user;
    try {
        const detail = await getUserDetailService(user);
        return res.status(200).json({
            message: "User detail fetched successfully",
            detail
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error
        });
    }
}