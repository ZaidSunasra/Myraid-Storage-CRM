import { prisma } from "../../libs/prisma.js";
import { GetProductOutput } from "zs-crm-common";

export const getProductsService = async (): Promise<GetProductOutput[]> => {
    const products = await prisma.product.findMany();
    return products;
}

export const addProductService = async (name: string)  :Promise<void> => {
    await prisma.product.create({
        data: {
            name: name,
        }
    });
}

export const editProductService = async (name: string, id: string) : Promise<void> => {
    await prisma.product.update({
        where: {
            id: parseInt(id)
        },
        data: {
            name: name
        }
    })
}