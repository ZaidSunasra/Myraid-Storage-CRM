import bcrypt from "bcryptjs"
import { prisma } from "../../libs/prisma"
import { AddUser, EditUser, GetUserDetailOutput} from "zs-crm-common"
import { User } from "@prisma/client";

export const findExistingEmail = async (email: string, user_id?: number): Promise<User | null> => {

    const user = await prisma.user.findFirst({
        where: {
            email: email,
            ...(user_id ? { id: { not: user_id } } : {}), 
        },
    });
    return user;
}

export const findExistingPhone = async (phone: string, user_id?: number): Promise<User | null> => {

    const user = await prisma.user.findFirst({
        where: {
            phone: phone,
            ...(user_id ? { id: { not: user_id } } : {}), 
        },
    });
    return user;
}

export const hashPassword = async (password: string): Promise<string> => {
    const hashPassword = await bcrypt.hash(password, 10);
    return hashPassword;
}

export const comparePassword = async (password: string, hashPassword: string): Promise<boolean> => {
    const compare = await bcrypt.compare(password, hashPassword);
    return compare;
}

export const addUser = async ({ first_name, last_name, email, phone, password, quotation_code, department }: AddUser): Promise<void> => {
    await prisma.user.create({
        data: {
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: await hashPassword(password),
            phone: phone,
            quotation_code: quotation_code,
            department: department
        }
    });
}

export const editUserService = async ({ first_name, last_name, email, phone, quotation_code, department }: EditUser, user_id: string): Promise<void> => {
    await prisma.user.update({
        where: {
            id: parseInt(user_id)
        },
        data: {
            first_name: first_name,
            last_name: last_name,
            email: email,
            phone: phone,
            quotation_code: quotation_code,
            department: department
        }
    });
}

export const changePasswordService = async (new_password: string, user: any) : Promise<void> => {
    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            password: new_password
        }
    });
}

export const resetPasswordService = async (new_password: string, user_id: string) : Promise<void> => {
    await prisma.user.update({
        where: {
            id: parseInt(user_id)
        },
        data: {
            password: new_password
        }
    });
}

export const getUserDetailService = async (user: any) : Promise<GetUserDetailOutput | null> => {
    const detail = await prisma.user.findUnique({
        where: {
            id: user.id
        },
        select: {
            last_name: true,
            first_name: true,
            email: true,
            phone: true,
            department: true,
            quotation_code: true,
            id: true
        }
    });
    return detail;
}