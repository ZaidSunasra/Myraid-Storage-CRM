import { Prisma } from "@prisma/client";
import { prisma } from "../../libs/prisma"
import { AddLead } from "./lead.types";

export const findExistingUser = async (email: string): Promise<Boolean> => {
    const user = await prisma.lead.findFirst({
        where: {
            email: email
        },
        select: {
            id: true
        }
    });
    return user?.id ? true : false;
}

export const findExistingCompany = async (company_name: string, gst_no: string, address: string): Promise<Boolean> => {
    const data = await prisma.company.findFirst({
        where: {
            OR: [
                { gst_no: gst_no },
                {
                    AND: [
                        { name: company_name },
                        { address: address }
                    ]
                }
            ]

        },
        select: {
            id: true,
        }
    });
    return data?.id ? true : false;
}

export const addLeadService = async ({ first_name, last_name, phone, email, description, assigned_to, source, product, company_name, address, gst_no }: AddLead): Promise<number> => {
    try {
        const result = await prisma.$transaction(async (tx) => {
            const company = await tx.company.create({
                data: {
                    name: company_name,
                    address: address,
                    gst_no: gst_no,
                },
            });
            const lead = await tx.lead.create({
                data: {
                    first_name: first_name,
                    last_name: last_name,
                    phone: phone,
                    email: email,
                    description: description,
                    company_id: company.id,
                    assigned_to: assigned_to,
                    source: source,
                    product: product
                }
            });
            return lead.id;
        })
        return result;
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002'
        ) {
            const target = (error.meta?.target as string[])?.join(', ') ?? 'field';
            throw new Error(`Unique constraint failed on the ${target}`);
        }
        throw error;
    }
}