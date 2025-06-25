import { z } from "zod/v4"; 

export const DEPARTMENTS = ["MARKETING", "ADMIN", "FACTORY", "DRAWING"] as const;

export const loginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password should be atleast 6 characters long")
});

export const signupSchema = z.object({
    first_name: z.string("First name required"),
    last_name: z.string("Last name required"),
    email: z.email("Invalid email address"),
    phone: z.string().max(10, "Invalid phone number"),
    password: z.string().min(6, "Password should be atleast 6 characters long"),
    department: z.enum(DEPARTMENTS),
    quotation_code: z.string().optional()
});

export type AddUser = z.infer<typeof signupSchema>;
export type LoginUser = z.infer<typeof loginSchema>;
