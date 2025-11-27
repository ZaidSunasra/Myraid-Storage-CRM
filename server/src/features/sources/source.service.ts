import { GetSourceOutput } from "zs-crm-common";
import { prisma } from "../../libs/prisma.js";

export const getSourcesService = async (): Promise<GetSourceOutput[]> => {
    const sources = await prisma.source.findMany();
    return sources;
}

export const addSourceService = async (name: string)  :Promise<void> => {
    await prisma.source.create({
        data: {
            name: name,
        }
    });
}

export const editSourceService = async (name: string, id: string) : Promise<void> => {
    await prisma.source.update({
        where: {
            id: parseInt(id)
        },
        data: {
            name: name
        }
    })
}