import { prisma } from "../../libs/prisma";
import { GetProductOutput } from "zs-crm-common";

export const getProductsService = async (): Promise<GetProductOutput[]> => {
    const products = await prisma.product.findMany();
    return products;
}