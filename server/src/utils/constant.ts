import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT;
export const URL = process.env.FE_URL

export const cookieOptions = {
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax" as "none" | "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
}
