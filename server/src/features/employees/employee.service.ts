import { DEPARTMENTS, GetEmployeeOutput } from "zs-crm-common";
import { prisma } from "../../libs/prisma";

export const getSalesEmployeeService = async (): Promise<GetEmployeeOutput[]> => {
    const employees = await prisma.user.findMany({
        where: {
            OR: [
                { department: DEPARTMENTS[1] },
                { department: DEPARTMENTS[0] }
            ]
        },
        select: {
            first_name: true,
            last_name: true,
            id: true
        }
    });
    return employees;
}

export const getAllEmployeeService = async (): Promise<GetEmployeeOutput[]> => {
    const employees = await prisma.user.findMany({
        where: {},
        select: {
            first_name: true,
            last_name: true,
            id: true
        }
    });
    return employees;
}

export const getAssignedEmployeeService = async (id: string, type: "deal" | "lead"): Promise<GetEmployeeOutput[]> => {
    const employees = await prisma.user.findMany({
        where: {
            OR: [
                {
                    asignee: {
                        some: {
                            lead_id: type === "lead" ? parseInt(id) : null,
                            deal_id: type === "deal" ? id : null
                        }
                    }
                },
                {
                    department: DEPARTMENTS[1]
                }
            ]
        },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            quotation_code: true
        }
    });
    return employees;
}