import { Client_Details, Company , EditClient, EditCompany} from "zs-crm-common";
import { prisma } from "../../libs/prisma"
import { convertEmailIntoArray, convertPhoneIntoArray } from "../../utils/dataFormatter";

export const getCompaniesService = async (name: string): Promise<Company[]> => {
    const companies = await prisma.company.findMany({
        where: name
            ? {
                name: {
                    contains: name,
                    mode: "insensitive",
                },
            }
            : {},
    });
    return companies;
}

export const getCompanyEmployeeService = async (id: string): Promise<Client_Details[]> => {
    const employees = await prisma.client.findMany({
        where: {
            company_id: parseInt(id)
        },
        include: {
            emails: {
                select: {
                    email: true
                }
            },
            phones: {
                select: {
                    phone: true
                }
            }
        }
    });
    return employees;
}

export const addClientService = async ({ first_name, last_name, emails, phones }: EditClient, company_id: string): Promise<void> => {
    const emailString = convertEmailIntoArray(emails);
    const phoneString = convertPhoneIntoArray(phones);
    await prisma.$transaction(async (tx) => {
        const client = await tx.client.create({
            data: {
                first_name: first_name,
                last_name: last_name,
                company_id: parseInt(company_id)
            },
            select: {
                id: true
            }
        });
        if (emails && emails?.length > 0) {
            await tx.email.createMany({
                data: emailString.map((email) => ({
                    email: email,
                    client_id: client.id
                }))
            })
        }
        await tx.phone.createMany({
            data: phoneString.map((phone) => ({
                phone: phone,
                client_id: client.id
            }))
        })
    })
}

export const editClientService = async ({ first_name, last_name, emails, phones, id }: EditClient, company_id: string): Promise<void> => {
    const emailString = convertEmailIntoArray(emails);
    const phoneString = convertPhoneIntoArray(phones);
    console.log(company_id)
    await prisma.$transaction(async (tx) => {
        const client = await tx.client.update({
            where: {
                id: parseInt(id || "")
            },
            data: {
                first_name: first_name,
                last_name: last_name,
                company_id: parseInt(company_id)
            },
            select: {
                id: true
            }
        });
        await tx.email.deleteMany({
            where: {
                client_id: parseInt(id || "0")
            }
        });
        await tx.phone.deleteMany({
            where: {
                client_id: parseInt(id || "0")
            }
        })
        if (emails && emails?.length > 0) {
            await tx.email.createMany({
                data: emailString.map((email) => ({
                    email: email,
                    client_id: client.id
                }))
            })
        }
        await tx.phone.createMany({
            data: phoneString.map((phone) => ({
                phone: phone,
                client_id: client.id
            }))
        })
    })
}

export const editCompanyDetailService = async ({ company_name, gst_no, address }: EditCompany, comapny_id: string): Promise<void> => {
    await prisma.company.update({
        where: {
            id: parseInt(comapny_id)
        },
        data: {
            name: company_name,
            gst_no: gst_no,
            address: address
        }
    })
}