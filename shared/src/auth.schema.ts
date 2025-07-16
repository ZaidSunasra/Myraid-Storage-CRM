import { z } from "zod/v4"; 

export const DEPARTMENTS = ["sales", "admin", "factory", "drawing"] as const;
export type department = typeof DEPARTMENTS[number]; 

export const loginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password should be atleast 6 characters long")
});

export const signupSchema = z.object({
    first_name: z.string().min(1,"First name required"),
    last_name: z.string().min(1,"Last name required"),
    email: z.email("Invalid email address"),
    phone: z.string().max(15, "Invalid phone number"),
    password: z.string().min(6, "Password should be atleast 6 characters long"),
    department: z.enum(DEPARTMENTS),
    quotation_code: z.string().optional()
});

export type LoginSuccessResponse = {
    message: string;
    userData: {
        email: string;
        code: string | null;
        name: string;
        department: department;
        id: number;
    }
};

export type SignupResponse = {
    message: string;
    error?: any;
};;

export type AddUser = z.infer<typeof signupSchema>;
export type LoginUser = z.infer<typeof loginSchema>;
