import axiosInstance from "../axiosInstance";
import type { ProductSelector, SuccessResponse, GetQuotationByDealSuccessResponse, GetQuotationByIdSuccessResponse, AddQuotation, QuotationBaseProductSuccessResponse, GetAllQuotationSuccessResponse, GetDetailByQuotationNumberSuccessResponse, GetCompactorDetailSuccessResponse } from "zs-crm-common";

export const getQuotationProducts = async (data: ProductSelector): Promise<QuotationBaseProductSuccessResponse> => {
    const response = await axiosInstance.post("/quotations/get-products", data);
    return response.data;
};

export const addQuotation = async ({ data, deal_id }: { data: AddQuotation, deal_id: string }): Promise<SuccessResponse> => {
    const response = await axiosInstance.post(`/quotations/add/${deal_id}`, data);
    return response.data;
};

export const getCompactorDetails = async (): Promise<GetCompactorDetailSuccessResponse> => {
    const response = await axiosInstance.get("/quotations/compactor");
    return response.data;
};

export const getQuotationByDeal = async (deal_id: string): Promise<GetQuotationByDealSuccessResponse> => {
    const response = await axiosInstance.get(`/quotations/get-by/${deal_id}`);
    return response.data;
};

export const getQuotation = async ({ page = 1, search, employeeIDs, rows, startDate, endDate, sortBy, sortOrder, }: { page: number; search: string; employeeIDs: string[]; rows: number; startDate: string; endDate: string; sortBy: string; sortOrder: string; }): Promise<GetAllQuotationSuccessResponse> => {
    const response = await axiosInstance.get(`/quotations/get-all?page=${page}&rows=${rows}&search=${search}&employeeID=${employeeIDs}&startDate=${startDate}&endDate=${endDate}&sortBy=${sortBy}&sortOrder=${sortOrder}`,);
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

export const getDetailByQuotationNumber = async (quotation_no: string): Promise<GetDetailByQuotationNumberSuccessResponse> => {
    const response = await axiosInstance.get(`/quotations/by-quotation-no/${quotation_no}`);
    return response.data;
}