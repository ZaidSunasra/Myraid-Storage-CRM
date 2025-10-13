import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getCompactorDetails, getQuotation, getQuotationByDeal, getQuotationById, getDetailByQuotationNumber } from "./quotations.api";

export const FetchCompactorDetails = () => {
    return useQuery({
        queryKey: ["comapctor"],
        queryFn: getCompactorDetails
    });
};


export const FetchQuotationByDeal = (deal_id: string) => {
    return useQuery({
        queryKey: ["quotationByDeal", deal_id],
        queryFn: () => getQuotationByDeal(deal_id)
    });
};

export const FetchQuotation = ({ page, search, employeeIDs, rows, startDate, endDate, sortBy, sortOrder, }: { page: number; search: string; employeeIDs: string[]; rows: number; startDate: string; endDate: string, sortBy: string; sortOrder: string; }) => {
    return useQuery({
        queryKey: ["quotation", page, search, employeeIDs, rows, startDate, endDate, sortBy, sortOrder],
        queryFn: () => getQuotation({ page, search, employeeIDs, rows, startDate, endDate, sortBy, sortOrder }),
        placeholderData: keepPreviousData
    });
};

export const FetchQuotationById = (id: string) => {
    return useQuery({
        queryKey: ["quotationById", id],
        queryFn: () => getQuotationById(id)
    });
};

export const FetchDetailByQuotationNumber = (quotation_no: string) => {
    return useQuery({
        queryKey: ["detailByQuotationNo", quotation_no],
        queryFn: () => getDetailByQuotationNumber(quotation_no),
        enabled: false
    });
};