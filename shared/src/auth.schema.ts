import { z } from "zod/v4"; 

export const DEPARTMENTS = ["MARKETING", "ADMIN", "FACTORY", "DRAWING"] as const;

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6)
});

export const signupSchema = z.object({
    first_name: z.string(),
    last_name: z.string(),
    email: z.email(),
    phone: z.string(),
    password: z.string().min(6),
    department: z.enum(DEPARTMENTS),
    quotation_code: z.string().optional()
});

export type AddUser = z.infer<typeof signupSchema>;