import { GetSourceOutput } from "zs-crm-common";
import { prisma } from "../../libs/prisma";

export const getSourcesService = async (): Promise<GetSourceOutput[]> => {
    const sources = await prisma.source.findMany();
    return sources;
}
