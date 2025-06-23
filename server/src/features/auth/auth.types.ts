import { z } from "zod/v4"
import { signupSchema } from "./auth.schema"
import { DEPARTMENTS } from "../../utils/constant"

export type AddUser = z.infer<typeof signupSchema>;
type department = typeof DEPARTMENTS[number]; 

export type LoginSuccessResponse = {
    message: string,
    userData: {
        email: string,
        code: string | null,
        name: string,
        department: department
    }
};

export type LoginFailureResponse = {
    message: string,
    error?: any
};

export type SignupResponse = LoginFailureResponse;
