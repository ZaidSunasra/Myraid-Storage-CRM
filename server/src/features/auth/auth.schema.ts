import { z } from "zod/v4";
import { DEPARTMENTS } from "../../utils/constant";

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
