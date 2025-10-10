import axiosInstance from "../axiosInstance";
import type { ProductSelector, SuccessResponse, GetQuotationByDealSuccessResponse, GetQuotationByIdSuccessResponse, AddQuotation, QuotationBaseProductSuccessResponse, GetAllQuotationSuccessResponse } from "zs-crm-common";

export const getQuotationProducts = async (data: ProductSelector): Promise<QuotationBaseProductSuccessResponse> => {
    const response = await axiosInstance.post("/quotations/get-products", data);
    return response.data;
};

export const addQuotation = async ({ data, deal_id }: { data: AddQuotation, deal_id: string }): Promise<SuccessResponse> => {
    const response = await axiosInstance.post(`/quotations/add/${deal_id}`, data);
    return response.data;
};

export const getQuotationByDeal = async (deal_id: string): Promise<GetQuotationByDealSuccessResponse> => {
    const response = await axiosInstance.get(`/quotations/get-by/${deal_id}`);
    return response.data;
};

export const getQuotation = async ({ page = 1, search, employeeIDs, rows, startDate, endDate, sortBy, sortOrder, }: { page: number; search: string; employeeIDs: string[]; rows: number; startDate: string; endDate: string; sortBy: string; sortOrder: string; }): Promise<GetAllQuotationSuccessResponse> => {
    const response = await axiosInstance.get(`/quotations/get-all`, {
        params: {
            page,
            rows,
            search,
            employeeID: employeeIDs,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        },
    });
    return response.data;
};

export const getQuotationById = async (id: string): Promise<GetQuotationByIdSuccessResponse> => {
    const response = await axiosInstance.get(`/quotations/get/${id}`);
    return response.data;
};

export const editQuotation = async ({ data, deal_id, id }: { data: AddQuotation, deal_id: string, id: string }): Promise<SuccessResponse> => {
    const response = await axiosInstance.put(`/quotations/edit/${deal_id}/${id}`, data);
    return response.data
}

export const copyQuotation = async ({ id, data }: { id: string, data: { deal_id: string } }): Promise<SuccessResponse> => {
    const response = await axiosInstance.post(`/quotations/import/${id}`, data);
    return response.data;
}

export const deleteQuotation = async (id: string): Promise<SuccessResponse> => {
    const response = await axiosInstance.delete(`/quotations/delete/${id}`);
    return response.data;
};