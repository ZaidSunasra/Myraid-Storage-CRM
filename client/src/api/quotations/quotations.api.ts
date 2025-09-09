import axiosInstance from "../axiosInstance";
import type { AddQuotation, SuccessResponse, product_type} from "zs-crm-common";

export const getQuotationProducts = async ({product_type, bay, compartment}: {product_type: product_type, bay: number, compartment: number}): Promise<any> => {
    const response = await axiosInstance.post("/quotations/get-products", {product_type, bay, compartment});
    return response.data;
};

export const addQuotation = async ({data, deal_id} : {data: AddQuotation, deal_id: string}): Promise<SuccessResponse> => {
    const response = await axiosInstance.post(`/quotations/add/${deal_id}`, data);
    return response.data;
};