import { Client_Details, Company } from "zs-crm-common";
import { prisma } from "../../libs/prisma"

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
