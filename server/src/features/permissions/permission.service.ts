import { department, GetPermissionOutput } from "zs-crm-common";
import { prisma } from "../../libs/prisma.js"

export const getPermissionsService = async () : Promise<GetPermissionOutput[]> => {
    const permissions = await prisma.permission.findMany({
        where: {},
        orderBy: {
            id: 'asc'
        }
    });
    return permissions;
}

export const editPermissionService = async (allowed_dept: department[], id: string) : Promise<void> => {
    await prisma.permission.update({
        where: {
            id: parseInt(id)
        },
        data: {
            allowed_dept: allowed_dept
        }
    })
}