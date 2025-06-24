import { Prisma } from "@prisma/client";
import { prisma } from "../../libs/prisma";
import { EditLead, FetchLeadOutput } from "./lead.types";
import { AddLead } from "zs-crm-common"

export const findExistingEmail = async (email: string, excludedId?: number): Promise<boolean> => {
    if (excludedId !== undefined) {
        const user = await prisma.lead.findFirst({
            where: {
                email,
                NOT: {
                    id: excludedId
                },
            },
        });
        return user?.email ? true : false;
    }
    const user = await prisma.lead.findUnique({
        where: {
            email
        },
    });
    return user?.email ? true : false;
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

export const findExistingGST = async (id: number, gst_no: string): Promise<boolean> => {
    const comapny = await prisma.company.findFirst({
        where: {
            gst_no,
            lead: {
                some: {
                    NOT: {
                        id
                    }
                }
            }
        }
    });
    return comapny?.gst_no ? true : false;
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

export const getLeadsService = async (user: any): Promise<FetchLeadOutput[]> => {
    const leads = await prisma.lead.findMany({
        where: user.department == "ADMIN" ? {} : { assigned_to: user.id },
        include: {
            company: true
        }
    });
    return leads;
}

export const editLeadService = async ({ id, first_name, last_name, phone, email, description, assigned_to, source, product, company_name, address, gst_no }: EditLead): Promise<any> => {
    await prisma.$transaction(async (tx) => {
        const updatedLead = await prisma.lead.update({
            where: {
                id: id
            },
            data: {
                first_name: first_name,
                last_name: last_name,
                phone: phone,
                email: email,
                description: description,
                assigned_to: assigned_to,
                source: source,
                product: product
            },
        });
        await prisma.company.update({
            where: {
                id: updatedLead.company_id
            },
            data: {
                address: address,
                gst_no: gst_no,
                name: company_name
            }
        });
    });
}