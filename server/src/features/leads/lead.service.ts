import { prisma } from "../../libs/prisma"

export const addLeadService = async () : Promise<any> => {
    prisma.leads.create({
        
    })
}
