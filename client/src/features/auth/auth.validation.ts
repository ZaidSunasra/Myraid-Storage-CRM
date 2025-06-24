import { z } from "zod/v4";

export const loginFormSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password should be more than 6 letters")
});
export type loginFormType = z.infer<typeof loginFormSchema>;