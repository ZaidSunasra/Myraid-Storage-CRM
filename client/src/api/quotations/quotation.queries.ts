import { useQuery } from "@tanstack/react-query";
import { getQuotation, getQuotationByDeal, getQuotationById } from "./quotations.api";

export const FetchQuotationByDeal = (deal_id: string) => {
    return useQuery({ 
        queryKey: ["quotationByDeal", deal_id], 
        queryFn: () => getQuotationByDeal(deal_id) 
    });
};

export const FetchQuotation = () => {
    return useQuery({ 
        queryKey: ["quotation"], 
        queryFn: getQuotation
    });
};

export const FetchQuotationById = (id: string) => {
    return useQuery({ 
        queryKey: ["quotationById", id], 
        queryFn: () => getQuotationById(id) 
    });
};