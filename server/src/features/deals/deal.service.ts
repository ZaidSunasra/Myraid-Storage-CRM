import { Deal_Status } from "@prisma/client";
import { prisma } from "../../libs/prisma"

export const getDealService = async(rows: number, page: number) : Promise<any>=> {
    const deals = await prisma.deal.findMany({
       where: {},
       take: rows,
       skip: (page - 1) * rows,
    });
    const totalDeals = await prisma.deal.count();
    return {deals, totalDeals};
};

export const getDealByCompanyService = async(company_id : string) : Promise<any>=> {
    const deals = await prisma.deal.findMany({
        where: {
            company_id: parseInt(company_id)
        }
    });
    return deals;
};

export const getDealByIdService = async(id: string) : Promise<any>=> {
    const deal = await prisma.deal.findUnique({
        where: {
            id: parseInt(id)
        }
    });
    return deal;
}

export const editDealStatusService = async (id: string, status: Deal_Status) : Promise<any> => {
    await prisma.deal.update({
        where: {
            id: parseInt(id)
        },
        data: {
            deal_status: status
        }
    });
}
