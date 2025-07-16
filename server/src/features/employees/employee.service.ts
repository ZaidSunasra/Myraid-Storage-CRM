import { DEPARTMENTS, GetEmployeeOutput} from "zs-crm-common";
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