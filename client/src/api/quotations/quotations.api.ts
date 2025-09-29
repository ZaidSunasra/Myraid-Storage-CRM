import axiosInstance from "../axiosInstance";
import type { ProductSelector, SuccessResponse, GetQuotationByDealSuccessResponse, GetQuotationSuccessResponse, GetQuotationByIdSuccessResponse, AddQuotation, QuotationBaseProductSuccessResponse } from "zs-crm-common";

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

export const getQuotation = async (): Promise<GetQuotationSuccessResponse> => {
    const response = await axiosInstance.get(`/quotations/get-all`);
    return response.data;
};

export const getQuotationById = async (id: string): Promise<GetQuotationByIdSuccessResponse> => {
    const response = await axiosInstance.get(`/quotations/get/${id}`);
    return response.data;
};