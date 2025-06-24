import bcrypt from "bcryptjs"
import { prisma } from "../../libs/prisma"
import { AddUser } from "zs-crm-common"
import { User } from "@prisma/client";

export const findExistingUser = async (email: string) : Promise<User | null> => {
    const user = await prisma.user.findUnique({
        where:{
            email: email
        }
    });
    return user;
}

export const hashPassword = async (password: string) : Promise<string> => {
    const hashPassword = await bcrypt.hash(password, 10);
    return hashPassword;
}

export const comparePassword = async(password: string, hashPassword: string) : Promise<boolean> => {
    const compare = await bcrypt.compare(password, hashPassword);
    return compare;
}

export const addUser = async({first_name, last_name, email, phone, password, quotation_code, department}: AddUser) : Promise <void> => {
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
